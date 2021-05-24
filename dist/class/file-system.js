"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    createFolderUser(userID) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads", userID);
        const pathUserTemp = pathUser + "/temp";
        if (!fs_1.default.existsSync(pathUser)) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generateUniqueName(originalFile) {
        const nameArr = originalFile.split('.');
        const extension = nameArr[nameArr.length - 1];
        const idUnique = uniqid_1.default();
        return `${idUnique}.${extension}`;
    }
    saveImageTemp(userID, file) {
        return new Promise((resolve, reject) => {
            const pathUserTemp = this.createFolderUser(userID);
            const fileName = this.generateUniqueName(file.name);
            file.mv(`${pathUserTemp}/${fileName}`, (error) => {
                if (error) {
                    return reject();
                }
                else {
                    return resolve(true);
                }
            });
        });
    }
    imageFromTempToAvatar(userID) {
        const pathUserTemp = path_1.default.resolve(__dirname, "../uploads", userID, "temp");
        const pathUserAvatar = path_1.default.resolve(__dirname, "../uploads", userID, "avatar");
        if (!fs_1.default.existsSync(pathUserTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathUserAvatar)) {
            fs_1.default.mkdirSync(pathUserAvatar);
        }
    }
    fileFromTempToRecibos(userID) {
        const pathReciboTemp = path_1.default.resolve(__dirname, "../uploads", userID, "recibos/temp");
        const pathReciboPost = path_1.default.resolve(__dirname, "../uploads", userID, "recibos/post");
        if (!fs_1.default.existsSync(pathReciboTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathReciboPost)) {
            fs_1.default.mkdirSync(pathReciboPost);
        }
        const Nombrerecibo = this.obtenerReciboTemp(userID);
        //console.log("Nombre del recibo ",Nombrerecibo)
        // Se trata de un solo recibo por lo tanto no genero arreglo, traigo uno solo
        fs_1.default.renameSync(`${pathReciboTemp}/${Nombrerecibo}`, `${pathReciboPost}/${Nombrerecibo}`);
        return Nombrerecibo;
    }
    obtenerReciboTemp(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, "recibos/temp");
        //console.log("estoy leyendo de: ", pathTemp)
        return fs_1.default.readdirSync(pathTemp)[0];
    }
    createFolderRecibo(userID) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads", userID, "recibos");
        const pathUserTemp = pathUser + "/temp";
        if (!fs_1.default.existsSync(pathUser)) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    saveReciboTemp(userID, file) {
        return new Promise((resolve, reject) => {
            const pathUserTemp = this.createFolderRecibo(userID);
            const fileName = this.generateUniqueName(file.name);
            file.mv(`${pathUserTemp}/${fileName}`, (error) => {
                if (error) {
                    return reject();
                }
                else {
                    return resolve(true);
                }
            });
        });
    }
}
exports.default = FileSystem;
