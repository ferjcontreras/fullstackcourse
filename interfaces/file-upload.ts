export interface IfileUpload {
    name: string,
    data: any,
    encoding: string,
    size: number,
    tempFilePath: string,
    trucated: boolean,
    mimetype: string,
    md5: string

    mv: Function
}