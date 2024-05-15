import mongoose from "mongoose";




interface Options {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {

    static async connect(options: Options) {
        const { mongoUrl, dbName } = options;

        try {
            await mongoose.connect(mongoUrl, {
                dbName
            })
            //console.log('mongo connected') // por si no anda la conección aca se prueba y hace.
            return true
        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }
    }
}

