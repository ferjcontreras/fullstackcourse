import path from 'path';
import fs from 'fs';
import { IfileUpload } from '../interfaces/file-upload';
import unidid from 'uniqid';

export default class FileSystem {
    constructor() { }

    private createFolderUser(userID: string): string {
        const pathUser = path.resolve(__dirname, "../uploads", userID);
        const pathUserTemp = pathUser + "/temp";

        if (!fs.existsSync(pathUser)) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    private generateUniqueName(originalFile: string): string {
        const nameArr = originalFile.split('.');
        const extension: string = nameArr[nameArr.length - 1];
        const idUnique = unidid();
        return `${idUnique}.${extension}`
    }

    saveImageTemp(userID: string, file: IfileUpload): Promise<any> {
        return new Promise((resolve, reject) => {
            const pathUserTemp = this.createFolderUser(userID);
            const fileName = this.generateUniqueName(file.name);

            file.mv(`${pathUserTemp}/${fileName}`, (error: any) => {
                if (error) {
                    return reject();
                } else {
                    return resolve(true);
                }
            })
        })
    }

    imageFromTempToAvatar(userID: string) {
        const pathUserTemp = path.resolve(__dirname, "../uploads", userID, "temp");
        const pathUserAvatar = path.resolve(__dirname, "../uploads", userID, "avatar");

        if (!fs.existsSync(pathUserTemp)) {
            return [];
        }

        if (!fs.existsSync(pathUserAvatar)) {
            fs.mkdirSync(pathUserAvatar)
        }
    }

    fileFromTempToRecibos(userID: string) {

        const pathReciboTemp = path.resolve(__dirname, "../uploads", userID, "recibos/temp");
        const pathReciboPost = path.resolve(__dirname, "../uploads", userID, "recibos/post");

        if (!fs.existsSync(pathReciboTemp)) {
            return [];
        }

        if (!fs.existsSync(pathReciboPost)) {
            fs.mkdirSync(pathReciboPost)
        }
        
        const Nombrerecibo:string = this.obtenerReciboTemp(userID);

        //console.log("Nombre del recibo ",Nombrerecibo)
     
        // Se trata de un solo recibo por lo tanto no genero arreglo, traigo uno solo
        fs.renameSync(`${pathReciboTemp}/${Nombrerecibo}` , `${pathReciboPost}/${Nombrerecibo}`);

        
        return Nombrerecibo;

    }

    private obtenerReciboTemp(userID: string):string {
        const pathTemp = path.resolve(__dirname, '../uploads', userID, "recibos/temp");
        //console.log("estoy leyendo de: ", pathTemp)
        return fs.readdirSync(pathTemp)[0];
    }

    private createFolderRecibo(userID:string) {
        const pathUser = path.resolve(__dirname, "../uploads", userID, "recibos");
        const pathUserTemp = pathUser + "/temp";

        if (!fs.existsSync(pathUser)) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    saveReciboTemp(userID: string, file: IfileUpload) {
        return new Promise((resolve, reject) => {
            const pathUserTemp = this.createFolderRecibo(userID);
            const fileName = this.generateUniqueName(file.name);

            file.mv(`${pathUserTemp}/${fileName}`, (error: any) => {
                if (error) {
                    return reject();
                } else {
                    return resolve(true);
                }
            })
        })
    }

}