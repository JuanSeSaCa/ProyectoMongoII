import { connect } from "../../helper/connect.js";

export class case_1 extends connect {

        static instance //Definimos una variable que contendra a la clase case_1

        //---------------------//
        //-- El constructor es lo primero que se ejecuta al momento de instanciar la clase (Invocarla)
        //-- Le pasamos al constructor un parametro (conexion), Este parametro será un diccionario 
        //-- con las credenciales de acceso a la base de datos.
        //-- Mediante (conexion) le indicaremos a la clase las credenciales que debe utilizar, esto permite
        //-- ingresar a la base de datos con diferentes usuarios que tengan diferentes roles, necesario para la actividad
        constructor(conexion){  
            if(typeof case_1.instance == "object"){ //El if lo que hace es decirle que si la variable instance = a la clase, retorne la variable
                return case_1.instance
            }
        //---------------------//


        //---------------------//
        //-- super() es la conexión de la clase con la clase padre, al utilizar super 
        //-- hacemos la relación entre el constructor de la clase connect y la clase case_1
        //-- Recordar que la clase connect es la que se encarga de establecer la conección con Railway
        //--
        //-- Al pasarle el parametro conexion al super(), estamos pasandole las credenciales de acceso
        //-- al constructor de la clase padre, esto le permitira a la clase mediante las funciones que tiene
        //-- establecer la conexión con las credenciales específicas que le pasemos en el parametro conexión

        super(conexion) 
        //---------------------//


        this.dbcollection = this.db.collection("Prueba") //Hacemos la conexión a la colección con la que queremos trabajar, 
        // this.dbcollection2 = this.db.collection("ColeccionEjemplo") //se puede conectar a varias colecciones (Esta coleccion no existe)

        case_1.instance = this //En caso de que la variable instance no sea igual a la clase, retornamos la clase y luego igualamos la variable a la clase
        return this
    }

    async getExample(){
        //Consulta de ejemplo
        let coleccion = await this.dbcollection.find({}).toArray() //Hacemos la consulta en la coleccion que queramos
        console.log(coleccion)
        
        //Retornamos la consulta
    }
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { ObjectId } from "mongodb";
import { connect } from "../../helper/connect.js";

export class case_1 extends connect {

        static instance //Definimos una variable que contendra a la clase case_1

        //---------------------//
        //-- El constructor es lo primero que se ejecuta al momento de instanciar la clase (Invocarla)
        //-- Le pasamos al constructor un parametro (conexion), Este parametro será un diccionario 
        //-- con las credenciales de acceso a la base de datos.
        //-- Mediante (conexion) le indicaremos a la clase las credenciales que debe utilizar, esto permite
        //-- ingresar a la base de datos con diferentes usuarios que tengan diferentes roles, necesario para la actividad
        constructor(conexion){  
            if(typeof case_1.instance == "object"){ //El if lo que hace es decirle que si la variable instance = a la clase, retorne la variable
                return case_1.instance
            }
        //---------------------//


        //---------------------//
        //-- super() es la conexión de la clase con la clase padre, al utilizar super 
        //-- hacemos la relación entre el constructor de la clase connect y la clase case_1
        //-- Recordar que la clase connect es la que se encarga de establecer la conección con Railway
        //--
        //-- Al pasarle el parametro conexion al super(), estamos pasandole las credenciales de acceso
        //-- al constructor de la clase padre, esto le permitira a la clase mediante las funciones que tiene
        //-- establecer la conexión con las credenciales específicas que le pasemos en el parametro conexión

        super(conexion) 
        //---------------------//


        this.equipos = this.db.collection("equipos")//Hacemos la conexión a la colección con la que queremos trabajar,
        this.jugador = this.db.collection("jugador")
        this.estadio = this.db.collection("estadios")
        this.entrenador = this.db.collection("entrenador")
        this.partidos = this.db.collection("partido")
        this.ciudad = this.db.collection("ciudad")
        // this.dbcollection2 = this.db.collection("ColeccionEjemplo") //se puede conectar a varias colecciones (Esta coleccion no existe)

        case_1.instance = this //En caso de que la variable instance no sea igual a la clase, retornamos la clase y luego igualamos la variable a la clase
        return this
    }

    async insertEquipo(nombre, ciudad, estadio, entrenador, jugadores, partidos){

        //Validacion de que no ha jugado partidos
        let validacionPartidos = false
        if (partidos.length == 0){
            validacionPartidos = true
        }
        else {
            console.log("No puedes crear un equipo que ya haya jugado partidos")
        }


        //Validacion de que los jugadores existen y no pertenecen a otro equipo
        let validacionJugadores = false
        let Jugador = await this.jugador.find({$and: [{_id: {$in: jugadores}}, {equipo: null}]}).toArray()
        if (Jugador.length == jugadores.length) {
            validacionJugadores = true
        }
        else {
            console.log("No puedes ingresar jugadores inexistentes o que pertenezcan a algún equipo")
        }

        //Validacion de que el entrenador exista y no esté en otro equipo
        let validacionEntrenador = false
        let Entrenador = await this.entrenador.find({_id: new ObjectId(entrenador)}).toArray()
        let EntrenadorEnEquipos = await this.equipos.find({entrenador: new ObjectId(entrenador)}).toArray()
        if (Entrenador.length > 0 && EntrenadorEnEquipos.length == 0){
            validacionEntrenador = true
        }
        else {
            console.log("No puedes ingresar un entrenador que no exista o que pertenezca a algún equipo")
        }

        //Validacion de que el estadio exista
        let validacionEstadio = false
        let Estadio = await this.estadio.find({_id: new ObjectId(estadio.id_estadio)}).toArray()
        if (Estadio.length > 0){
            validacionEstadio = true
        }
        else {
            console.log("El estadio no existe")
        }


        //Validacion de que la ciudad exista

        let validacionCiudad = false
        let Ciudad = await this.ciudad.find({_id: new ObjectId("66a00ea8431b3f8211b44ed8")}).toArray()
        if (Ciudad.length > 0){
            validacionCiudad = true
        }
        else {
            console.log("La ciudad no existe")
        }


        //Se insertan los datos traidos desde el main
        let equipoIngresado = false
        if(validacionCiudad == true && validacionEntrenador == true && validacionEstadio == true && validacionJugadores == true && validacionPartidos){
            equipoIngresado = true
            await this.equipos.insertOne({
                nombre: nombre,
                ciudad: new ObjectId(ciudad),
                estadio: estadio, 
                entrenador: new ObjectId(entrenador),
                jugadores: jugadores,
                partidos: partidos
            })
        }


        //Se actualizan los jugadores
        if (equipoIngresado == true){
            let equipoFinal = await this.equipos.find({entrenador: new ObjectId(entrenador)}).toArray()
            await this.jugador.updateMany({_id: {$in: jugadores}}, {$set: {equipo: equipoFinal[0]._id, estado: "Activo"}})
            return "El equipo se ha ingresado existosamente"
        }
        else {return "El equipo no se pudo ingresar"}
    }









    async updateEquipos(idEquipo, llaveUpdate, cambio){

        //Consultamos el equipo
        let validacionEquipo = false
        let Equipo = await this.equipos.find({_id: new ObjectId(idEquipo)}).toArray()
        if (Equipo.length > 0){validacionEquipo = true}


        //Validamos que la llave a modificar es correcta
        let validacionKeys = false
        if(validacionEquipo == true){
        let equipoKeys = Object.keys(Equipo[0])
        equipoKeys.forEach(val =>{
            if(val == llaveUpdate){validacionKeys = true}
        })
        }


        //Validamos si la llave es nombre
        if(validacionKeys == true && llaveUpdate == "nombre"){
            if (typeof cambio == "string"){
                await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$set: {nombre: cambio}})
                return "El nombre se cambio exitosamente"
            }
            else if(typeof cambio != "string"){
                return "El nombre no es compatible con la validacion"
            }
        }


        //Validamos si la llave es ciudad
        if(validacionKeys == true && llaveUpdate == "ciudad"){
            let validacionCiudad = false
            if (typeof cambio == "string" && cambio.length == 24){

                let Ciudad = await this.ciudad.find({_id: new ObjectId(cambio)}).toArray()
                if (Ciudad.length > 0){validacionCiudad = true} 
                else if(Ciudad.length == 0){console.log("El id de la ciudad ingresada no existe.")}

            }
            if (validacionCiudad == true){
                await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$set: {ciudad: new ObjectId(cambio)}})
                return"La ciudad se ha cambiado exitosamente"
            }
            else{return "El cambio no se pudo realizar debido a que no es un cambio valido"}
        }


        //Validamos si la llave es estadio
        if(validacionKeys == true && llaveUpdate == "estadio"){
            let validacionEstadio = false
            let Estadio = ""
            let validacionKeysEstadio = 0
            if(typeof cambio == "object"){
                let keys = Object.keys(cambio)
                keys.forEach(val =>{if (val == "id_estadio" || val == "nombre"){validacionKeysEstadio +=1}})
                if (typeof cambio.id_estadio == "string" && cambio.id_estadio.length == 24){validacionKeysEstadio +=1}
                else {console.log("El id ingresado en id_estadio no es valido")}
            }
            else if(typeof cambio != "object"){console.log("El cambio a realizar no es valido")}
            if (validacionKeysEstadio == 3){
                Estadio = await this.estadio.find({_id: new ObjectId(cambio.id_estadio)}).toArray()
                if (Estadio.length > 0){validacionEstadio = true}
            }
            if (validacionEstadio == true){
                await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$set: {estadio: cambio}})
                return "El estadio se actualizo exitosamente"
            }
            else{return "El cambio no se pudo realizar debido a que no es valido"}
        }


        //Validamos si la llave es entrenador
        if(validacionKeys == true && llaveUpdate == "entrenador"){
            let validacionEntrenador = false
            if (typeof cambio == "string" && cambio.length == 24){
                let Entrenador = await this.entrenador.find({_id: new ObjectId(cambio)}).toArray()
                let EntrenadorEnEquipos = await this.equipos.find({entrenador: new ObjectId(cambio)}).toArray()
                if (Entrenador.length > 0 && EntrenadorEnEquipos.length == 0){
                    validacionEntrenador = true
                }
            }
            if (validacionEntrenador == true){
                await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$set: {entrenador: new ObjectId(cambio)}})
                return "Se ha cambiado el entrenador exitosamente"
            }
            return "El cambio no se pudo realizar debido a que el entrenador ya está ocupado con un equipo"
        }


        //Validamos si la llave es jugadores
        if(validacionKeys == true && llaveUpdate == "jugadores"){
            let validacionJugador = false

            //Validamos que el jugador exista
            if (typeof cambio == "string" && cambio.length == 24){
                let Jugador = await this.jugador.find({_id: new ObjectId(cambio)}).toArray()
                if (Jugador.length > 0){validacionJugador = true}
                else {return "El jugador no existe"}

                if (validacionJugador == true){

                    //Si el jugador pertenece al equipo, lo sacamos
                    if (Jugador[0].equipo == idEquipo){
                        //Sacamos al jugador y actualizamos su equipo
                        await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$pull: {jugadores: new ObjectId(cambio)}})
                        await this.jugador.updateOne({_id: new ObjectId(cambio)}, {$set: {equipo: null}})
                        return "El jugador ha sido extraido exitosamente del equipo"
                    }

                    //Si el jugador es de otro equipo, lo metemos
                    if (Jugador[0].equipo != idEquipo && Jugador[0].equipo != null){
                        let equipoASacar = Jugador[0].equipo
                        //Introducimos al jugador y actualizamos los equipos
                        await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$push: {jugadores: new ObjectId(cambio)}})
                        await this.equipos.updateOne({_id: new ObjectId(equipoASacar)}, {$pull: {jugadores: new ObjectId(cambio)}})
                        await this.jugador.updateOne({_id: new ObjectId(cambio)}, {$set: {equipo: new ObjectId(idEquipo)}})
                        return "Se ha realizado con exito el cambio de equipo"
                    }

                    //Si el jugador no tiene equipo, lo ingresamos
                    if (Jugador[0].equipo == null){
                        await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$push: {jugadores: new ObjectId(cambio)}})
                        await this.jugador.updateOne({_id: new ObjectId(cambio)}, {$set: {equipo: new ObjectId(idEquipo)}})
                        return "El jugador se ha ingresado al equipo"
                    }
                }
            }
        }

        //Validamos si la llave es partidos
        if(validacionKeys == true && llaveUpdate == "partidos"){
            let validacionPartido = false
            let validacionPertenece = false
            if (typeof cambio == "string" && cambio.length == 24){

                let Partido = await this.partidos.find({_id: new ObjectId(cambio)}).toArray()
                if (Partido.length > 0){validacionPartido = true}
                if (validacionPartido == true){
                    if(Partido[0].equipoVisitante == idEquipo || Partido[0].equipoLocal == idEquipo){
                        validacionPertenece = true
                    }
                }
            }

            //Si el partido no pertenece al equipo y esta dentro de partidos, lo elimina
            if (validacionPertenece == false){
                Equipo = await this.equipos.find({_id: new ObjectId(idEquipo), $partidos: new ObjectId(cambio)}).toArray()
                if (Equipo.length > 0){
                    await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$pull: {partidos: new ObjectId(cambio)}})
                    return "El partido que no correspondía al equipo se ha eliminado exitosamente"
                }
            }

            //Si el partido esta dentro de partidos, lo elimina, de lo contrario, lo ingresa
            if(validacionPertenece == true){
                Equipo = await this.equipos.find({_id: new ObjectId(idEquipo), partidos: new ObjectId(cambio)}).toArray()
                if (Equipo.length > 0){
                    await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$pull: {partidos: new ObjectId(cambio)}})
                    return "El partido se ha eliminado exitosamente"
                }
                else if(Equipo.length == 0){
                    await this.equipos.updateOne({_id: new ObjectId(idEquipo)}, {$push: {partidos: new ObjectId(cambio)}})
                    return "El partido se ha ingresado exitosamente"
                }
            }
        }
    }








//////////////////////////////////////////////////



    async removeEquipos(idEquipo) {
        //Consultamos el equipo
        let validacionEquipo = false
        let Equipo = await this.equipos.find({_id: new ObjectId(idEquipo)}).toArray()
        if (Equipo.length > 0){validacionEquipo = true}
        if (validacionEquipo == true){
            await this.equipos.deleteOne({_id: new ObjectId(idEquipo)})
            await this.jugador.updateMany({equipo: new ObjectId(idEquipo)}, {$set: {equipo: null}})
            return "Se ha eliminado el equipo exitosamente"     
        }
        else{return "El equipo no existe"}
    }
}
 
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////