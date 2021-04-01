export const computedViewUri = (bucketName: string, key: string, folder?: string) => {
    return folder ? `https://file.40017.cn/${bucketName}${folder}${key}` : `https://file.40017.cn/${bucketName}${key}`;
};