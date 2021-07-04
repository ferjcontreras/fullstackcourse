import { Request, Response } from 'express';
import fs from '../class/file-system';
import { IfileUpload } from '../interfaces/file-upload';
import IRecibo from '../interfaces/IRecibo';
import queryGenerica from '../utils/promesas';

const fileSystem = new fs();

export async function create(req: any, res: Response) {
    const newRecibo = <IRecibo>{
        idUsuarioContador: req.usuario._id,
        idUsuarioEmpleado: req.body.id_usuario_empleado,
        idTipoRecibo: req.body.id_tipo_recibo,
        fecha: req.body.fecha,
        sueldo_neto: req.body.sueldo_neto,
        sueldo_bruto: req.body.sueldo_bruto
    }


    if (req.usuario.idRol == 2) { // solo permite agregar el recibo si tiene el rol de contador
        try {
            const archivoRecibo = await fileSystem.fileFromTempToRecibos(String(newRecibo.idUsuarioEmpleado));
            await queryGenerica('start transaction');
            await queryGenerica("INSERT INTO recibo (idUsuarioContador, idUsuarioEmpleado, idTipoRecibo, fecha, sueldo_neto, sueldo_bruto, archivo) VALUES (?,?,?,?,?,?,?)", [newRecibo.idUsuarioContador, newRecibo.idUsuarioEmpleado, newRecibo.idTipoRecibo, newRecibo.fecha, newRecibo.sueldo_neto, newRecibo.sueldo_bruto, archivoRecibo.toString()]);
            await queryGenerica('commit');
            res.json({
                estado: "success",
                data: "Recibo Agregado Correctamente",
                token: ""
            })
        } catch (error) {
            const rollback = await queryGenerica('rollback');   //puede ir sin await(si no necesito ningun dato del rollback)
            res.json(
                {
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

export async function uploadRecibo(req: any, res: Response) {
    const archivo: IfileUpload = req.files.archivo;
    const Recibo = {
        idUsuario: req.body.id_usuario,
        /*idRecibo: req.body.id_recibo*/
    }

    if (req.usuario.idRol == 2) { // Si se trata de un contador, entonces si puedo subir el recibo, de lo contrario no
        if (!req.files) {
            return res.status(400).json({
                estado: "error",
                data: "No se encontró ningún archivo",
                token: ""
            })
        }
        if (!archivo.mimetype.includes("image") && !archivo.mimetype.includes("pdf")) { // solo permite archivos de imagenes y pdf
            return res.status(400).json({
                estado: "error",
                data: "Formato de imagen incorrecto",
                token: ""
            })
        }
        await fileSystem.saveReciboTemp(Recibo.idUsuario, archivo)
        res.json({
            estado: "success",
            data: archivo,
            token: ""
        })
    }
    else {
        res.json({
            estado: "error",
            data: "Usted no tiene privilegios para realizar esta operación",
            token: ""
        })
    }
}