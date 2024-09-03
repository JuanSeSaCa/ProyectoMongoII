// index.cjs
const { MongoClient } = require("mongodb");
require('dotenv').config();

class Connect {
    constructor() {
        this.user = process.env.VITE_MONGO_USER;
        this.pass = process.env.VITE_MONGO_PWD;
        this.host = process.env.VITE_MONGO_HOST;
        this.port = process.env.VITE_MONGO_PORT;
        this.dbName = process.env.VITE_MONGO_DB;

        if (!this.user || !this.pass || !this.host || !this.port || !this.dbName) {
            throw new Error("Las variables de entorno necesarias no están configuradas correctamente.");
        }

        this.client = new MongoClient(`mongodb://${this.user}:${this.pass}@${this.host}:${this.port}/`, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log("Conectado a MongoDB");
            this.db = this.client.db(this.dbName);
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error.message);
            throw error;
        }
    }

    async close() {
        try {
            await this.client.close();
            console.log("Desconectado de MongoDB");
        } catch (error) {
            console.error("Error al desconectar de MongoDB:", error.message);
        }
    }
}

module.exports = Connect;