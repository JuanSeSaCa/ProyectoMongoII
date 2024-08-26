// const Peliculas = require("./model/peliculasModel.js").Peliculas;
// const Funciones = require("./model/funcionesModel.js").Funciones;
// const Clientes = require("./model/clientesModel.js").Clientes;
// const Asientos = require("./model/asientosModel.js").Asientos;
// const Boletas = require("./model/boletasModel.js").Boletas;


// //* Instanciar el objeto Peliculas
 let pelicula = new Peliculas();

// //* Obtener todas las películas disponibles
 pelicula.getAllFilmsAvailable().then(console.log);

// //* Obtener detalles de una película específica por ID
 // pelicula.getAllDetailsFilms({id:'66a6cdd3a7ff449f3519ecd6'}).then(console.log);

// //* Instanciar el objeto Clientes
//let clientes = new Clientes();


// //* Obtener detalles de un usuario específico por ID
// clientes.obtenerDetallesUsuario({id:'66c48b92d571a320405791ed'}).then(console.log);

//* Obtener todos los clientes
// clientes.findClientes().then(console.log);
// //* Cambiar Rol de Usuario
// clientes.actualizarRolUsuario({id:'66c48b92d571a320405791ee', nuevoRol:'Administrador'}).then(console.log);

// //* Crear un nuevo usuario en la base de datos
// clientes.crearUsuario({
  //    nombre: 'Emilia',
//    apellido: 'gomez',
//    nickname:'emigo',
//    email: emigoo@correo.com',
//   telefono: '3546166655',
//   contrasena: 'gomezemi123',
//   categoria: 'Usuario Estandar',
// }).then(console.log);

// //* Instanciar el objeto Funciones
//let funcion = new Funciones();

// //* Reservar asientos para una función específica
// funcion.reservarAsientos({id:'66b275ffd541a250404781d7', asientosSeleccionados: ['a1', 'a2']}).then(console.log);

// //* Encontrar boletos disponibles para una función específica
// funcion.findAvailableBoletas({id:'66b275ffd541a250404781d6'}).then(console.log);

// //* Cancelar reserva de asientos
// funcion.cancelarReserva({id:'66b275ffd541a250404781d6', asientosCancelar: ['a1', 'a2']}).then(console.log);

// //* Verificar la validez de una tarjeta VIP para un cliente específico
// clientes.verificarTarjetaVIP({id:'66c48b92d571a320405791ee', numeroTarjeta:'5432109876543210'}).then(console.log);


//let asientos = new Asientos()
// asientos.findAsientos().then(console.log);