import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Token from '../class/token';
import { verificarToken } from "../middlewares/authentication";
import queryGenerica from '../utils/promesas';
import { IfileUpload } from '../interfaces/file-upload';
import FileSystem from '../class/file-system';

const fileSystem = new FileSystem();

const UsuarioRoutes = Router();    //no new! Router no es clase


UsuarioRoutes.post("/login", async (req: Request, res: Response) => {
    const Usuario = {
        nick: req.body.nick,
        password: req.body.password
    }
    try {
        const userLoguin: any = await queryGenerica("SELECT id, password, email, idRol, idPersona FROM usuario WHERE nick = ?", [Usuario.nick]);
        bcrypt.compare(Usuario.password, userLoguin[0].password, function (err, res2) {
            if (res2) {

                const tokenJwt = Token.getToken({
                    _id: userLoguin[0].id,
                    nick: Usuario.nick,
                    email: userLoguin[0].email,
                    rol: userLoguin[0].idRol,
                    idpersona: userLoguin[0].idPersona
                })

                res.json({ estado: "success", token: tokenJwt })
            } else {
                res.json({ estado: "error", message: "La contraseña no coincide" })
            }
        });
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
})

UsuarioRoutes.post("/create", async (req: Request, res: Response) => {
    const newUsuario = {
        nick: req.body.nick,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    try {
        await queryGenerica('start transaction');
        await queryGenerica("INSERT INTO usuario (nick, password, email) VALUES (?,?,?)", [newUsuario.nick, newUsuario.password, newUsuario.email]);
        await queryGenerica('commit');
        res.json({ estado: "success" })
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
})

UsuarioRoutes.put("/update", verificarToken, async (req: any, res: Response) => {
    const Usuario = {
        /*id: req.body.id,*/
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    try {
        await queryGenerica('start transaction');
        const update: any = await queryGenerica("UPDATE usuario SET email = ?, password= ? WHERE id = ?", [Usuario.email, Usuario.password, req.usuario._id]);
        await queryGenerica('commit');
        if (update.affectedRows > 0) {
            res.json({ estado: "success", message: `Se han actualizado ${update.affectedRows} registros` })
        } else {
            res.json({ estado: "error", message: `No se encontraron usuarios para actualizar` })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
})

UsuarioRoutes.put("/setRol", async (req: any, res: Response) => {
    const Usuario = {
        id: req.body.id,
        idRol: req.body.idRol
    }
    try {
        await queryGenerica('start transaction');
        const update: any = await queryGenerica("UPDATE usuario SET idRol = ? WHERE id = ?", [Usuario.idRol, Usuario.id]);
        await queryGenerica('commit');
        if (update.affectedRows > 0) {
            res.json({ estado: "success", message: `Se han actualizado ${update.affectedRows} registros` })
        } else {
            res.json({ estado: "error", message: `No se pudo setear el Rol` })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
})

UsuarioRoutes.put("/setPersona", async (req: any, res: Response) => {
    const Usuario = {
        id: req.body.id,
        idPersona: req.body.idPersona
    }
    try {
        await queryGenerica('start transaction');
        const update: any = await queryGenerica("UPDATE usuario SET idPersona = ? WHERE id = ?", [Usuario.idPersona, Usuario.id]);
        await queryGenerica('commit');
        if (update.affectedRows > 0) {
            res.json({ estado: "success", message: `Se han actualizado ${update.affectedRows} registros` })
        } else {
            res.json({ estado: "error", message: `No se pudo setear la Persona` })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
})

UsuarioRoutes.post("/uploadAvatar", async (req: any, res: Response) => {
    const avatar: IfileUpload = req.files.avatar;
    const Usuario = {
        id: req.body.id
    }

    if (!req.files) {
        return res.status(400).json({
            estado: "error",
            mensaje: "No se encontró ninguna imagen"
        })
    }

    if (!avatar.mimetype.includes("image")) {
        return res.status(400).json({
            estado: "error",
            mensaje: "Formato de imagen incorrecto"
        })
    }

    await fileSystem.saveImageTemp(Usuario.id, avatar)

    res.json({ estado: "success", message: avatar.name })
})


export default UsuarioRoutes;