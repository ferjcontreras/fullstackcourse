import mysql from 'mysql';
import { env_bdd } from '../config';

//Conexion MySql
const connectionMySql = mysql.createConnection({
    host: env_bdd.DB_HOST,
    port: Number(env_bdd.DB_PORT),
    user: env_bdd.DB_USER,
    password: env_bdd.DB_PASSWORD,
    database: env_bdd.DB_NAME
})

export default connectionMySql;