import express from 'express';
import { env_server } from '../config';

class Server {
    public app: express.Application;
    public host: string = env_server.SERVER_HOST;
    public port: any = env_server.SERVER_PORT;

    constructor() {
        this.app = express();
    }

    start(callback: any) {
        this.app.listen(this.port, this.host, callback)
    }
}

export default Server;