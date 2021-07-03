import Server from "./class/server";
import connectionMySql from "./bin/connection_MySql";
import bodyParser from "body-parser";
import fileUpload from 'express-fileupload';
//rutas
import HomeRoutes from "./routes/home";
import usuarioRoutes from "./routes/usuario";
import RecibosRoutes from "./routes/recibos";
import PersonasRoutes from "./routes/personas"

import cors from 'cors';
import rateLimit from 'express-rate-limit';

const MiServer = new Server();

//start server
MiServer.start(() => {
	console.log(`Servidor corriendo en ${MiServer.host}:${MiServer.port}`)
})

//body parser
MiServer.app.use(bodyParser.urlencoded({ extended: true }));
MiServer.app.use(bodyParser.json());

//Cors
const allowedOrigins = ['http://localhost:4200'];

const options: cors.CorsOptions = {
	origin: allowedOrigins
};
MiServer.app.use(cors(options));


//limitador peticiones 
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Ha superado el limite de peticiones"
});
MiServer.app.use(limiter);

//upload
MiServer.app.use(fileUpload());



//start bddMySql
connectionMySql.connect((error) => {
	if (error) {
		throw error
	} else {
		console.log("Aplicacion conectada a BDD MySQL")
	}
});

//rutas aplicacion
MiServer.app.use("/", HomeRoutes);				//localhost:PORT/
MiServer.app.use("/usuario", usuarioRoutes);	//localhost:PORT/usuario
MiServer.app.use("/recibo", RecibosRoutes);		//localhost:PORT/recibo
MiServer.app.use("/persona", PersonasRoutes);	//localhost:PORT/persona