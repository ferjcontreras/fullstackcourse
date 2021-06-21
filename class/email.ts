import nodemailer from 'nodemailer';
import path from 'path';
import { env_email } from '../config';

export default class email {

    host: string = "smtp-mail.outlook.com" // o "outlook.office365.com"
    port: number = 587
    secure: boolean = false
    tsl: boolean = false
    auth = {
        user: env_email.EMAIL_USER,
        pass: env_email.EMAIL_PASS
    }

    constructor() {

    }

    //enviar un mail con un adjunto x defecto
    enviarEmail(emailDestino: string, emailAsunto: string, emailCuerpo: string = "", html: string = ""): Promise<any> {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
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
            })
            const mailOptions = {
                from: this.auth.user,
                to: emailDestino,
                subject: emailAsunto,
                text: emailCuerpo,
                html: html,
                attachments: [
                //    {
                  //      path: path.resolve(__dirname, '../assets', 'imagen_default.png')
                  //  }
                ]
            }

            nodemailer.createTestAccount((error) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return reject(error)
                    } else {
                        return resolve(info);
                    }
                })
            })
        })
    }
}