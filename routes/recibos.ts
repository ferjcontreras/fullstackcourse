import { Router } from 'express';
import { verificarToken } from "../middlewares/authentication";
import * as recibosController from '../controllers/recibos';

const RecibosRoutes = Router();

RecibosRoutes.post("/create", verificarToken, recibosController.create)

RecibosRoutes.post("/uploadRecibo", verificarToken, recibosController.uploadRecibo)

RecibosRoutes.get("/readAll", verificarToken, recibosController.readAll)

RecibosRoutes.get("/getArchivo/:archivo/:userId", recibosController.getArchivo)

export default RecibosRoutes;