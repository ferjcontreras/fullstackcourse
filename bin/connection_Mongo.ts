import moongose from 'mongoose';

//Conexion Mongo
class DatabaseMongo {
    public CONECTION;

    constructor(host: string, port: number, user: string, password: string, database: string) {
        this.CONECTION = moongose.connect(`mongodb://${host}:${port}/${database}`,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            (error) => {
                if (error) {
                    throw error
                } else {
                    console.log("Aplicacion conectada a Mongo");
                };
            });
    }
}
export default DatabaseMongo;