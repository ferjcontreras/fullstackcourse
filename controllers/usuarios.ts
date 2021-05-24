import { Request, Response } from 'express';
import Token from '../class/token';
import bcrypt from 'bcrypt';
import emailClass from '../class/email';
import queryGenerica from '../utils/promesas';
import { IfileUpload } from '../interfaces/file-upload';
import fs from '../class/file-system';

const fileSystem = new fs();

export async function login(req: any, res: Response) {
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
                    idRol: userLoguin[0].idRol,
                    idPersona: userLoguin[0].idPersona
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
}

export async function create(req: Request, res: Response) {
    const newUsuario = {
        nick: req.body.nick,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    try {
        await queryGenerica('start transaction');
        await queryGenerica("INSERT INTO usuario (nick, password, email) VALUES (?,?,?)", [newUsuario.nick, newUsuario.password, newUsuario.email]);
        await queryGenerica('commit');
        const email = new emailClass();
        await email.enviarEmail(req.body.email, 'Creación de Usuario', 'Su usuario ha sido creado correctamente')
        res.json({ estado: "success" })
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
}

export async function update(req: any, res: Response) {
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
}

export async function setRol(req: any, res: Response) {
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
}

export async function setPersona(req: any, res: Response) {
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
}

export async function uploadAvatar(req: any, res: Response) {
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
}