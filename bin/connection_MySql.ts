import mysql from 'mysql';
import variables_entorno from '../config';

//Conexion MySql
const connectionMySql = mysql.createConnection({
    host: variables_entorno.HOST_DB,
    port: Number(variables_entorno.PORT_DB),
    user: variables_entorno.USER_DB,
    password: variables_entorno.PASSWORD_DB,
    database: variables_entorno.DB_MYSQL
})

export default connectionMySql;