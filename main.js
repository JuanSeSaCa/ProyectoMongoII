import {Asientos} from "./js/modules/asientos.js";
import { Funciones } from "./js/modules/funciones.js";
import { Clientes } from "./js/modules/cliente.js";
import { Peliculas } from "./js/modules/peliculas.js";


// //* Instanciar el objeto Peliculas
 //let pelicula = new Peliculas();

// //* Obtener todas las películas disponibles
 // console.log(await pelicula.getAllFilmsAvailable());
 

// //* Obtener detalles de una película específica por ID
 //console.log(await pelicula.getAllDetailsFilms({id: "66a6cdd3a7ff449f3519ecd8"}));

// //* Instanciar el objeto Clientes
//let clientes = new Clientes();
// console.log(clientes.obtenerDetallesUsuario); // Debería mostrar [Function: obtenerDetallesUsuario]

// //* Obtener detalles de un usuario específico por ID
// console.log(await clientes.obtenerDetallesUsuario({id:'66c48b92d571a320405791f3'}));

//* Obtener todos los clientes
//console.log(await clientes.findClientes());

// //* Cambiar Rol de Usuario
// console.log( await clientes.actualizarRolUsuario({id:'66b28bc85d478ba080d0ff95',nuevoRol:'Administrador'})) 

// //* Crear un nuevo usuario en la base de datos
//  console.log(await clientes.crearUsuario({
//    nombre: 'Laura',
//    apellido: 'Petro',
//    nickname:'Laupetro',
//    email: 'laupetro@correo.com',
//   telefono: '3526548855',
//   contrasena: 'laupetro123',
//   categoria: 'Usuario Estandar',
// }));

// //* Instanciar el objeto Funciones
//let funcion = new Funciones();

// //* Reservar asientos para una función específica
//console.log(await funcion.reservarAsientos({id:'66b275ffd541a250404781d7', asientosSeleccionados: ['a1', 'a2']}));

// //* Encontrar boletos disponibles para una función específica
//console.log(await funcion.findAvailableTickets({id:'66b275ffd541a250404781d9'}));

// //* Cancelar reserva de asientos
//console.log(await funcion.cancelarReserva({id:'66b275ffd541a250404781d7', asientosCancelar: ['a1', 'a2']}));

// //* Verificar la validez de una tarjeta VIP para un cliente específico
//console.log(await clientes.verificarTarjetaVIP({id:'66c48b92d571a320405791ed', numeroTarjeta:'4444333322221111'})); 


//let asientos = new Asientos()
//console.log(await asientos.findAsientos())