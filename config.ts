import dotenv from 'dotenv';
import path from 'path';

//server
dotenv.config({
    path: path.resolve(__dirname, '../env', process.env.NODE_ENV + '.env')
});
let env_server = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    SERVER_HOST: process.env.HOST || 'localhost',
    SERVER_PORT: process.env.PORT || 3000
}

//bdd
dotenv.config({
    path: path.resolve(__dirname, '../env/bdd.env')
});
let env_bdd = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME
}

//email
dotenv.config({
    path: path.resolve(__dirname, '../env/email.env')
});
let env_email = {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
}

export { env_server, env_bdd, env_email };