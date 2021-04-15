import * as vscode from "vscode";
import * as path from "path";
import { getBuckets, getDataList } from "./leonApi";
import { imgTypes, otherTypes } from "./fileTypes";
import { ITEM_ICON_MAP } from './index';

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Dependency | undefined | void
  > = new vscode.EventEmitter<Dependency | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    Dependency | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: Dependency): Promise<Dependency[]> {
    if (element) {
      const { bucketName, key } = element.ops;
      const res: any = await getDataList(bucketName, key);
      if (res.code === 0 && res.result) {
        const result = res.result.map((item: any) => {
          const isFile = this.isFile(item.key);
          return new Dependency(
            {
              bucketName,
              key: `/${item.key}`,
              contextValue: isFile ? "File" : "Floder",
              isFile
            },
            item.key.replace(key.replace(/\//, ""), "").replace(/\//g, ""),
            item.key,
            isFile
              ? vscode.TreeItemCollapsibleState.None
              : vscode.TreeItemCollapsibleState.Collapsed
          );
        });
        return Promise.resolve(result);
      } else {
        return Promise.resolve([]);
      }
    } else {
      const res: any = await getBuckets();
      if (res.code === 0 && res.result) {
        const result = res.result.map((item: any) => {
          return new Dependency(
            {
              bucketName: item.bucket_name,
              key: "/",
              contextValue: "Floder",
            },
            item.bucket_name,
            item.asset_key,
            vscode.TreeItemCollapsibleState.Collapsed
          );
        });
        return Promise.resolve(result);
      } else {
        return Promise.resolve([]);
      }
    }
  }

  private isFile(fileName: string) {
    const ends = [...imgTypes, ...otherTypes];
    return ends.some((e) => fileName.includes(e));
  }
}

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly ops: any,
    public readonly label: string,
    public readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.contextValue = ops.contextValue;
  }

  command = {
    title: this.label, // 标题
    command: "itemClick", // 命令 ID
    tooltip: this.label, // 鼠标覆盖时的小小提示框
    arguments: [
      this.ops, // 目前这里我们只传递一个 label
    ],
  };

  iconPath = Dependency.getIconUriForLabel(this.ops);

  static getIconUriForLabel(ops: Object): vscode.Uri {
    console.log(ITEM_ICON_MAP.get('floder'));
    return vscode.Uri.file(
      path.join(
        __filename,
        "..",
        "..",
        "..",
        "images",
        "floder.svg" + ""
      )
    );
  }
}
