export const computedViewUri = (bucketName: string, key: string, folder?: string) => {
    return folder ? `https://file.40017.cn/${bucketName}${folder}${key}` : `https://file.40017.cn/${bucketName}${key}`;
};

export const ITEM_ICON_MAP = new Map<string, string>([
    ['folder', 'floder.svg']
]);