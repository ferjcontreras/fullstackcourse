import { Request, Response } from 'express';
import queryGenerica from '../utils/promesas';
import bcrypt from 'bcrypt';
import unidid from 'uniqid';
import emailClass from '../class/email';

export async function create(req: any, res: Response) {
    const newPersona = {
        tipoDoc: req.body.tipo_Doc,
        n_doc: req.body.num_Doc,
        nombre: req.body.nombre_persona,
        apellido: req.body.apellido_persona,
        fecha_nac: req.body.fecha_Nac,
        email: req.body.email
    }
    //console.log(req.usuario);
    if (req.usuario.idRol == 1 || req.usuario.idRol == 2) { // solo permite agregar el recibo si tiene el rol de admin o contador
        try {
            await queryGenerica('start transaction');
            const insertPersona:any = await queryGenerica("INSERT INTO persona (tipoDoc, n_doc, nombre, apellido, fecha_nacimiento) VALUES (?,?,?,?,?)", [newPersona.tipoDoc, newPersona.n_doc, newPersona.nombre, newPersona.apellido, newPersona.fecha_nac]);
            
            // Creamos un usuario de manera automática con el nick igual al DNI y una contraseña generada aleatoriamente
            const hashAleatorio = unidid(); // generamos la password aleatoria
            const passAleatoria = unidid(); // solo a los efectos de que recién se crea el usuario y que no tenga password
            await queryGenerica("INSERT INTO usuario (idPersona, idRol, nick, email, hash, password) VALUES (?, ?, ?, ?, ?, ?)", [insertPersona.insertId, 3, newPersona.n_doc, newPersona.email, hashAleatorio, bcrypt.hashSync(passAleatoria, 10)]);
            await queryGenerica('commit');
            
            // Emvío de email
            const email = new emailClass();
            //await email.enviarEmail(req.body.email, 'Creación de Usuario', '', `<p><b>Hola  ${newPersona.nombre}  ${newPersona.apellido}! </b></p> <p> Tu registro ha sido creado exitosamente! El nick de tu usuario es ${newPersona.n_doc} </p><p> Para generar la clave solo tienes que hacer click <a href="http://localhost:4200/generarPassword/${hashAleatorio}">aqu&iacute;</a></p> `)
            await email.enviarEmail(req.body.email, 'Creación de Usuario', '', "<b>Hola "+newPersona.nombre+" "+newPersona.apellido+"!</b><p>Tu registro ha sido creado! Nick: "+newPersona.n_doc+"</p><p>Para generar su clave haga click <a href='http://localhost:4200/"+hashAleatorio+"'>aquí</a></p>")
            res.json({ 
                estado: "success",
                message: "Persona creada correctamente!",
                token: ""
             })
        } catch (error) {
            const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ 
                estado: "error", 
                data: error, 
                token: "" 
            })
        }
    }
    else {
        res.json({
            estado: "error",
            data: "usted no tiene privilegios para realizar esta operación",
            token: ""
        })
    }
}

export async function update(req: any, res: Response) {
    // Los usuarios pueden modificar sus datos como Nombre, Apellido, Fecha de Nacimiento, Tipo y Numero de Doc
    const updPersona = {
        id: req.body.idPersona,
        tipoDoc: req.body.tipoDoc,
        n_doc: req.body.n_doc,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fecha_nac: req.body.fecha_nac
    }
    if (req.usuario.idRol == 1 || req.usuario.idRol == 2) { // solo permite agregar el recibo si tiene el rol de admin o contador
        try {
            await queryGenerica('start transaction');
            await queryGenerica("UPDATE persona SET tipoDoc = ?, n_doc = ?, nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id = ?", [updPersona.tipoDoc, updPersona.n_doc, updPersona.nombre, updPersona.apellido, updPersona.fecha_nac, updPersona.id]);
            await queryGenerica('commit');
            res.json({ 
                estado: "success",
                data: "Operación Exitosa",
                token: ""
            })
        } catch (error) {
            const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ estado: "error", 
            data: error, 
            token: "" 
            })
        }
    }
}