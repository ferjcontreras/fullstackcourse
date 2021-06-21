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
                res.json({
                    estado: "success",
                    data: {
                        id: userLoguin[0].id,
                        nick: Usuario.nick,
                        email: userLoguin[0].email,
                        idRol: userLoguin[0].idRol,
                        idPersona: userLoguin[0].idPersona
                    },
                    token: tokenJwt
                })
            } else {
                res.json({
                    estado: "error",
                    data: "La contraseña no coincide",
                    token: ""
                })
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
        res.json({ 
            estado: "error", 
            data: error, 
            token: "" 
        })
    }
}

export async function read(req: any, res: Response) {
    res.json({ 
        estado: "success", 
        data: req.usuario,
        token: ""
    })
}

export async function update(req: any, res: Response) {
    const Usuario = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    try {
        await queryGenerica('start transaction');
        const update: any = await queryGenerica("UPDATE usuario SET email = ?, password= ? WHERE id = ?", [Usuario.email, Usuario.password, req.usuario._id]);
        await queryGenerica('commit');
        if (update.affectedRows > 0) {
            res.json({ 
                estado: "success", 
                data: `Se han actualizado ${update.affectedRows} registros`,
                token: "" 
            })
        } else {
            res.json({ 
                estado: "error", 
                data: `No se encontraron usuarios para actualizar`, 
                token: ""
            })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({
            estado: "error",
            data: error,
            token: ""
        })
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
            res.json({
                estado: "success",
                data: `Se han actualizado ${update.affectedRows} registros`,
                token: ""
            })
        } else {
            res.json({
                estado: "error",
                data: `No se pudo setear el Rol`,
                token: ""
            })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ 
            estado: "error", 
            data: error, 
            token: "" 
        })
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
            res.json({ 
                estado: "success", 
                data: `Se han actualizado ${update.affectedRows} registros`, 
                token: "" 
            })
        } else {
            res.json({ 
                estado: "error", 
                data: `No se pudo setear la Persona`, 
                token: "" })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ 
            estado: "error", 
            data: error, 
            token: "" 
        })
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
            data: "No se encontró ninguna imagen",
            token: ""
        })
    }

    if (!avatar.mimetype.includes("image")) {
        return res.status(400).json({
            estado: "error",
            data: "Formato de imagen incorrecto",
            token: ""
        })
    }

    await fileSystem.saveImageTemp(Usuario.id, avatar)

    res.json({ estado: "success", data: avatar.name, token: "" })
}

export async function generarClave(req: any, res: Response) {
    
    const uHash = req.body.userHash; // hash, viene en el url
    const newPass = bcrypt.hashSync(req.body.password, 10); // password, viene en el body
    //const nick = req.body.nick;

    try {
        await queryGenerica('start transaction');
        const update: any = await queryGenerica("UPDATE usuario SET password = ? WHERE hash = ?",[newPass, uHash]);
        const registroPersona: any =  await queryGenerica("SELECT persona.nombre, persona.apellido, persona.m_doc FROM persona LEFT JOIN usuario WHERE usuario.hash = ? ",[uHash]);
        await queryGenerica('commit');
        if (update.affectedRows > 0) {
            console.log(update)
            // Le devolvemos info al usuario por email
      //      const UsuarioCreado: any = await queryGenerica("SELECT persona.nombre, persona.apellido, persona.n_doc FROM ");

            res.json({ 
                estado: "success", 
                data: `Clave generada correctamente`,
                token: "" 
            })
        } else {
            res.json({ 
                estado: "error", 
                message: `Error al actualizar clave`,
                token: "" 
            })
        }
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({
            estado: "error",
            data: error,
            token: ""
        })
    }
}