"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
class email {
    constructor() {
        this.host = "smtp-mail.outlook.com"; // o "outlook.office365.com"
        this.port = 587;
        this.secure = false;
        this.tsl = false;
        this.auth = {
            user: config_1.env_email.EMAIL_USER,
            pass: config_1.env_email.EMAIL_PASS
        };
    }
    //enviar un mail con un adjunto x defecto
    enviarEmail(emailDestino, emailAsunto, emailCuerpo = "", html = "") {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer_1.default.createTransport({
                host: this.host,
                port: this.port,
                secure: this.secure,
                auth: {
                    user: this.auth.user,
                    pass: this.auth.pass,
                },
                tls: {
                    rejectUnauthorized: this.tsl
                }
            });
            const mailOptions = {
                from: this.auth.user,
                to: emailDestino,
                subject: emailAsunto,
                text: emailCuerpo,
                html: html,
                attachments: [
                    {
                        path: path_1.default.resolve(__dirname, '../assets', 'imagen_default.png')
                    }
                ]
            };
            nodemailer_1.default.createTestAccount((error) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        return resolve(info);
                    }
                });
            });
        });
    }
}
exports.default = email;
