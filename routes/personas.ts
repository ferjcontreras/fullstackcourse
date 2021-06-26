import { Router } from 'express';
import { verificarToken } from "../middlewares/authentication";
import * as personaController from '../controllers/personas';

const PersonasRoutes = Router();

PersonasRoutes.post("/create", verificarToken, personaController.create)

PersonasRoutes.post("/update", verificarToken, personaController.update)

PersonasRoutes.get("/readAll", verificarToken, personaController.readAll)

PersonasRoutes.post("/readOne", verificarToken, personaController.readOne)

export default PersonasRoutes;