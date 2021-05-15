import mysql from 'mysql';

//Conexion MySql
const connectionMySql = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: "recibos_app"
})



export default connectionMySql;