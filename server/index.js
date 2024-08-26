// * Importación del cliente de MongoDB
const { MongoClient } = require("mongodb");

// * Clase para manejar la conexión a MongoDB
class Connect {
    // * Propiedades públicas
    user;   // Usuario de MongoDB
    port;   // Puerto de conexión

    // /! Propiedades privadas (usando #)
    #pass;      // Contraseña para la conexión a MongoDB
    #host;      // Host del servidor de MongoDB
    #cluster;   // Cluster de MongoDB
    #dbName;    // Nombre de la base de datos

    // * Constructor de la clase
    constructor() {
        // * Asignación de valores desde las variables de entorno
        this.user = process.env.MONGO_USER;        // Usuario desde variable de entorno
        this.port = process.env.MONGO_PORT;        // Puerto desde variable de entorno
        this.setPass = process.env.MONGO_PWD;      // Contraseña desde variable de entorno
        this.setHost = process.env.MONGO_HOST;     // Host desde variable de entorno
        this.setCluster = process.env.MONGO_CLUSTER; // Cluster desde variable de entorno
        this.setDbName = process.env.MONGO_DB;     // Nombre de la base de datos desde variable de entorno

        // * Apertura de la conexión a la base de datos
        this.#open();

        // * Asignación de la base de datos a la propiedad db
        this.db = this.conexion.db(this.getDbName);
    }

    // * Métodos setters y getters para las propiedades privadas

    set setPass(pass) { this.#pass = pass; }  // ! Establecer la contraseña de manera privada
    set setHost(host) { this.#host = host; }  // ! Establecer el host de manera privada
    set setCluster(cluster) { this.#cluster = cluster; }  // ! Establecer el cluster de manera privada
    set setDbName(dbName) { this.#dbName = dbName; }  // ! Establecer el nombre de la base de datos de manera privada

    get getPass() { return this.#pass; }  // ! Obtener la contraseña privada
    get getHost() { return this.#host; }  // ! Obtener el host privado
    get getCluster() { return this.#cluster; }  // ! Obtener el cluster privado
    get getDbName() { return this.#dbName; }  // ! Obtener el nombre de la base de datos privada

    // TODO: Método privado para abrir la conexión a la base de datos
    async #open() {
        // * Construcción de la URI de conexión dependiendo del usuario
        const uri = this.user !== "mongo" 
            ? `${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}/${this.getDbName}` 
            : `${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}`;

        // * Creación del cliente de MongoDB con la URI generada
        this.conexion = new MongoClient(uri);
        
        // * Conexión al servidor de MongoDB
        await this.conexion.connect();
        console.log("Connected to MongoDB");
    }

    // * Método para cerrar la conexión a la base de datos
    async close() {
        // * Cierra la conexión existente
        await this.conexion.close();
        console.log("Disconnected from MongoDB");
    }
}

// * Exportación de la clase Connect
module.exports = Connect;
