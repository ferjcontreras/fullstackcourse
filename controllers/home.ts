import { Request, Response } from 'express';

export async function index(req: Request, res: Response) {
    res.json({
        estado: "success",
        mensaje: 'Usted está en Home'
    })
}