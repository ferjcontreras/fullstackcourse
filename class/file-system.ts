import path from 'path';
import fs from 'fs';
import { IfileUpload } from '../interfaces/file-upload';
import unidid from 'uniqid';

export default class FileSystem {
    constructor() { }

    private createFolderUser(userID: string) {
        const pathUser = path.resolve(__dirname, "../uploads", userID);
        if (!fs.existsSync(pathUser)) {
            fs.mkdirSync(pathUser);
        }
    }

    private generateUniqueName(originalFile: string): string {
        const nameArr = originalFile.split('.');
        const extension: string = nameArr[nameArr.length - 1];
        const idUnique = unidid();
        return `${idUnique}.${extension}`
    }

    saveAvatarFS(userID: string, file: IfileUpload): Promise<any> {
        return new Promise((resolve, reject) => {
           // const pathUserTemp = this.createFolderUser(userID);
            const pathUserAvatar = path.resolve(__dirname, "../uploads", userID, "avatar");
            const fileName = this.generateUniqueName(file.name);

            this.createFolderUser(userID);
            fs.rmdirSync(pathUserAvatar,{
                recursive: true
            });
            fs.mkdirSync(pathUserAvatar)            

            file.mv(`${pathUserAvatar}/${fileName}`, (error: any) => {
                if (error) {
                    return reject();
                } else {                    
                    return resolve(fileName);
                }
            })
        })
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

        const Nombrerecibo: string = this.obtenerReciboTemp(userID);

        //console.log("Nombre del recibo ",Nombrerecibo)

        // Se trata de un solo recibo por lo tanto no genero arreglo, traigo uno solo
        fs.renameSync(`${pathReciboTemp}/${Nombrerecibo}`, `${pathReciboPost}/${Nombrerecibo}`);


        return Nombrerecibo;

    }

    private obtenerReciboTemp(userID: string): string {
        const pathTemp = path.resolve(__dirname, '../uploads', userID, "recibos/temp");
        //console.log("estoy leyendo de: ", pathTemp)
        return fs.readdirSync(pathTemp)[0];
    }

    private borrarRecibosTemporales(userID: string) {
        const pathTemp = path.resolve(__dirname, '../uploads', userID, "recibos/temp");

        if (fs.existsSync(pathTemp)) {
            const temporales = fs.readdirSync(pathTemp)

            temporales.forEach(temporal=>{
                fs.unlinkSync(`${pathTemp}/${temporal}`);
            })
        }
       
    }

    private createFolderRecibo(userID: string) {


        const pathUser = path.resolve(__dirname, "../uploads", userID, "recibos");
        const pathUserTemp = pathUser + "/temp";

        //console.log("pathUserTemp "+pathUserTemp)
        //console.log("pathUser "+pathUser)

        if (!fs.existsSync(pathUser)) {
            fs.mkdirSync(path.resolve(__dirname, "../uploads", userID))
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    saveReciboTemp(userID: string, file: IfileUpload) {
        this.borrarRecibosTemporales(userID)
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

    getAvatar(userId: string, avatarName: string): string {

        const pathFoto: string = path.resolve(__dirname, '../uploads', userId, "avatar", avatarName);
        if (fs.existsSync(pathFoto)) {
            return pathFoto
        } else {
            return path.resolve(__dirname, '../assets/default-avatar.jpg')
        }
    }

    getArchivoUrl(userId: string, archivo: string) {
        const pathRecibo:string = path.resolve(__dirname, '../uploads', userId, "recibos/post", archivo);
        console.log(pathRecibo)
        if(fs.existsSync(pathRecibo)){
            return pathRecibo
        }
        return "no_encontrado.pdf"
    }

}