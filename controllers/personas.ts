import { Request, Response } from 'express';
import queryGenerica from '../utils/promesas';

export async function create(req: any, res: Response) {
    const newPersona = {
        tipoDoc: req.body.tipoDoc,
        n_doc: req.body.n_doc,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fecha_nac: req.body.fecha_nac
    }
    if (req.usuario.rol == 2) { // solo permite agregar el recibo si tiene el rol de contador
        try {
            await queryGenerica('start transaction');
            await queryGenerica("INSERT INTO persona (tipoDoc, n_doc, nombre, apellido, fecha_nacimiento) VALUES (?,?,?,?,?)", [newPersona.tipoDoc, newPersona.n_doc, newPersona.nombre, newPersona.apellido, newPersona.fecha_nac]);
            await queryGenerica('commit');
            res.json({ estado: "success" })
        } catch (error) {
            const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ estado: "error", data: error, rollback: rollback })
        }
    }
    else {
        res.json({
            estado: "error",
            mensaje: "usted no tiene privilegios para realizar esta operación"
        })
    }
}

export async function update(req: any, res: Response) {
    // Los usuarios pueden modificar sus datos como Nombre, Apellido, Fecha de Nacimiento, Tipo y Numero de Doc
    const newPersona = {
        tipoDoc: req.body.tipoDoc,
        n_doc: req.body.n_doc,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fecha_nac: req.body.fecha_nac
    }
    try {
        await queryGenerica('start transaction');
        await queryGenerica("UPDATE persona SET tipoDoc = ?, n_doc = ?, nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id = ?", [newPersona.tipoDoc, newPersona.n_doc, newPersona.nombre, newPersona.apellido, newPersona.fecha_nac, req.usuario.idpersona]);
        await queryGenerica('commit');
        res.json({ estado: "success" })
    } catch (error) {
        const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback })
    }
}