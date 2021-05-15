import express from 'express';

class Server {
    public app: express.Application;
    public host: string;
    public port: number;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
        this.app = express();
    }

    start(callback: any) {
        this.app.listen(this.port, this.host, callback)
    }
}

export default Server;