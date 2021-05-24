import { Router, Request, Response } from 'express';
import FileSystem from '../class/file-system';
import emailClass from '../class/email'

const fileSystem = new FileSystem();

const HomeRoutes = Router();    //no new! Router no es clase



HomeRoutes.get("/", async (req: Request, res: Response) => {
    const email = new emailClass();
    const emailInfo = await email.enviarEmail('pitta1881@gmail.com', 'holaasunto', 'cuerpoEmail', '<h1>Hola Mundo</h1>')

    res.json({
        estado: "success",
        mensaje: emailInfo
    })

})

export default HomeRoutes;