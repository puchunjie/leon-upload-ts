export const computedViewUri = (bucketName: string, key: string, folder?: string) => {
    return folder ? `https://file.40017.cn/${bucketName}${folder}${key}` : `https://file.40017.cn/${bucketName}${key}`;
};

export const ITEM_ICON_MAP = new Map<string, string>([
    ['Bucket', 'bucket.svg'],
    ['Floder', 'floder.svg'],
    ['Img', 'img.svg'],
    ['js', 'js.svg'],
    ['css', 'css.svg'],
    ['zip', 'zip.svg'],
    ['text', 'text.svg'],
    ['md', 'md.svg'],
    ['mp3', 'mp3.svg'],
    ['mp4', 'mp4.svg'],
    ['text', 'text.svg'],
    ['html', 'html.svg'],
    ['unknow', 'unknow.svg']
]);