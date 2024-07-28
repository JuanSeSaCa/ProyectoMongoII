*/*

import { ObjectId } from "mongodb";
import { case_1 } from "./consults/case_1.js";

//Ejemplo de como seria el archivo conexion que le pasamos a la clase
//Esta conexion es la conexion root
const AdminLiga = {
    user: "AdminLiga",
    port: "47323",
    pass: "adli123",
    host: "mongodb://",
    cluster: "roundhouse.proxy.rlwy.net",
    dbName: "David"
}

const root = {
    user: "mongo",
    port: "47323",
    pass: "bVNAAXGVQnfuZOXZOySGXydlTSQQspUC",
    host: "mongodb://",
    cluster: "roundhouse.proxy.rlwy.net",
    dbName: ""
}


let clase = await new case_1(AdminLiga)
// console.log(await clase.insertEquipo(
//     "Bucaramanga FC",                                                                           //Nombre del equipo
//     "66a00ea8431b3f8211b44ed8",                                                                 //Ciudad
//     {id_estadio: new ObjectId("66a00b28431b3f8211b44ed7"), nombre: "Estadio Alfonzo López"},    //Estadio
//     "66a019ff8a8ce8af20ba4b60",                                                                 //Entrenador
//     [new ObjectId("66a01d488a8ce8af20ba4b77"), new ObjectId("66a01d488a8ce8af20ba4b78"), new ObjectId("66a01d488a8ce8af20ba4b79"), new ObjectId("66a01d488a8ce8af20ba4b7a"),
//     new ObjectId("66a01d488a8ce8af20ba4b7b"), new ObjectId("66a01d488a8ce8af20ba4b7c"), new ObjectId("66a01d488a8ce8af20ba4b7d"), new ObjectId("66a01d488a8ce8af20ba4b7e"),
//     new ObjectId("66a01d488a8ce8af20ba4b7f"), new ObjectId("66a01d488a8ce8af20ba4b80"), new ObjectId("66a01d488a8ce8af20ba4b81")],       //Jugadores
//     []                                                                                          //Partidos
//     ))


// ------- Funcion para editar equipos ------- //
// console.log(await clase.updateEquipos(
// "66a10b1e1322e69b9f930f58"   //ID del equipo
// , "partidos",                //Llave a modificar
// "66a12cfb93c0541780099e42"   //Cambio a realizar
// ))


// ------- Funcion para eliminar equipos ------- //
// console.log(await clase.removeEquipos(
// "66a10b1e1322e69b9f930f58"   //ID del equipo
// ))

*/