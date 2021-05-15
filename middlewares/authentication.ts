import Token from '../class/token';
import { NextFunction, Response } from 'express';

export const verificarToken = (req: any, res: Response, next: NextFunction) => {
    const userToken = req.get("x-token") || "";

    Token.checkToken(userToken)
        .then(decoded => {
            if (Date.now() > (decoded.exp * 1000)) {
                req.refreshToken = Token.getToken(decoded.usuario);
            }
            req.usuario = decoded.usuario;
            next();
        })
        .catch(error => {
            res.json({
                estado: "success",
                mensaje: "Token incorrecto",
                error: error
            })
        })
}