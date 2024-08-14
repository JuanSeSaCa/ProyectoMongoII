import {Asientos} from "./js/modules/asientos.js";
import { Funciones } from "./js/modules/funciones.js";
import { Clientes } from "./js/modules/cliente.js";
import { Peliculas } from "./js/modules/peliculas.js";


// //* Instanciar el objeto Peliculas
let pelicula = new Peliculas();

// //* Obtener todas las películas disponibles
  // console.log(await pelicula.getAllFilmsAvailable());
 

// //* Obtener detalles de una película específica por ID
// console.log(await pelicula.getAllDetailsFilms({id: "66a6cdd3a7ff449f3519ecdb"}));

// //* Instanciar el objeto Clientes
let clientes = new Clientes();

// //* Obtener detalles de un usuario específico por ID
console.log(await clientes.obtenerDetallesUsuario({id:'66c48b92d571a320405791ed'}));

// //* Obtener todos los clientes
// console.log(await clientes.findClientes());

// //* Cambiar Rol de Usuario
// console.log( await clientes.actualizarRolUsuario({id:'66b28bc85d478ba080d0ff95',nuevoRol:'Administrador'})) 

// //* Crear un nuevo usuario en la base de datos
//console.log(await clientes.crearUsuario({
//    nombre: 'Juan Carlos',
//    apellido: 'Garcia',
//    nickname:'JuanCaGa',
//    email: 'juan.garcia@correo.com',
//telefono: '3506125486',
//contraseña: 'juancaga2'
//    categoria: 'Administrador',
//

//
//}));

// //* Instanciar el objeto Funciones
let funcion = new Funciones();

// //* Reservar asientos para una función específica
// console.log(await funcion.reservarAsientos({id:'66b275ffd541a250404781d6', asientosSeleccionados: ['a1', 'a2']}));

// //* Encontrar boletos disponibles para una función específica
// console.log(await funcion.findAvailableBoletas({id:'66b275ffd541a250404781d6'}));

// //* Cancelar reserva de asientos
// console.log(await funcion.cancelarReserva({id:'66b275ffd541a250404781d6', asientosCancelar: ['a1', 'a2']}));

// //* Verificar la validez de una tarjeta VIP para un cliente específico
// console.log(await clientes.verificarTarjetaVIP({id:'66aa7785a0f7d729adeb619a', numeroTarjeta:'1111222233334444'})); 


let asientos = new Asientos()
//console.log(await asientos.findAsientos())