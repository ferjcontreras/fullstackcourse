import { Router } from 'express';
import * as homeController from '../controllers/home';

const HomeRoutes = Router();    //no new! Router no es clase

HomeRoutes.get("/", homeController.index)

export default HomeRoutes;