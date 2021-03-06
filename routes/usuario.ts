import { Router } from 'express';
import { verificarToken } from "../middlewares/authentication";
import * as usuarioController from '../controllers/usuarios';

const UsuarioRoutes = Router();    //no new! Router no es clase

UsuarioRoutes.post("/login", usuarioController.login);

UsuarioRoutes.post("/create", usuarioController.create);

UsuarioRoutes.get("/read", verificarToken, usuarioController.read)

UsuarioRoutes.put("/update", verificarToken, usuarioController.update)

UsuarioRoutes.put("/changePassword", verificarToken, usuarioController.changePassword)

UsuarioRoutes.put("/setRol", usuarioController.setRol)

UsuarioRoutes.put("/setPersona", usuarioController.setPersona)

UsuarioRoutes.put("/uploadAvatar", verificarToken, usuarioController.uploadAvatar)

UsuarioRoutes.post("/generarClave", usuarioController.generarClave)

UsuarioRoutes.get("/getAvatar", verificarToken, usuarioController.getAvatar)

export default UsuarioRoutes;