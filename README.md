📕 **Título: CineCampus**

------

variables de entorno para conexión:

MONGO_USER="mongo"
MONGO_PORT="27017"
MONGO_PWD="llyfGdBqEGUyIBdNBuygTmoPHBesrxjq"
MONGO_HOST="mongodb://"
MONGO_CLUSTER="monorail.proxy.rlwy.net"
MONGO_DB="cineCampus"



**Tiempo de ejecución**: 4 Dias

**Nivel de dificultad:** ★★★★☆

### **Problematica**

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

### **Objetivo**

Desarrollar una serie de APIs para la aplicación web de CineCampus utilizando MongoDB como base de datos. Las APIs deberán gestionar la selección de películas, la compra de boletos, la asignación de asientos, y la implementación de descuentos para tarjetas VIP, con soporte para diferentes roles de usuario.

### **Requisitos Funcionales**

1. Selección de Películas:
   - **API para Listar Películas:** Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.
   - **API para Obtener Detalles de Película:** Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.




Estructura del Código
=====================

Películas
Descripción: Módulo para gestionar operaciones relacionadas con las películas.


Código de Ejemplo:

import { Peliculas } from "./js/modules/peliculas.js";

// Instanciar el objeto Peliculas
let pelicula = new Peliculas();

// Obtener todas las películas disponibles
console.log(await pelicula.getAllFilmsAvailable());

// Obtener detalles de una película específica por ID
console.log(await pelicula.getAllDetailsFilms('66a412c85358b6683f5b8baf'));
Funciones
Descripción: Módulo para reservas de asientos y disponibilidad de boletos.

Código de Ejemplo:

import { Funciones } from "./js/modules/funciones.js";

// Instanciar el objeto Funciones
let funcion = new Funciones();

// Reservar asientos para una función específica
console.log(await funcion.reservarAsientos('66b275ffd541a250404781d6', ['a1', 'a2']));

// Encontrar boletos disponibles para una función específica
console.log(await funcion.findAvailableTickets('66b275ffd541a250404781d6'));

// Cancelar reserva de asientos
console.log(await funcion.cancelarReserva('66b275ffd541a250404781d6', ['a1', 'a2']));
Clientes
Descripción: Módulo para gestionar información de clientes y verificar tarjetas VIP.

Código de Ejemplo:

import { Clientes } from "./js/modules/cliente.js"

// Instanciar el objeto Clientes
let clientes = new Clientes();

// Verificar la validez de una tarjeta VIP para un cliente específico
console.log(await clientes.verificarTarjetaVIP('66c48b92d571a320405791ed', '4444333322221111'));

// Crear un nuevo usuario en la base de datos
console.log(await clientes.crearUsuario('Alicia', 'Jackson', 'aliciaj', 'alice.johnson@example.com', '1234567890', 'password123', 'Administrador'));

// Obtener detalles de un usuario específico por ID
console.log(await clientes.obtenerDetallesUsuario('66c48b92d571a320405791f3'));

// Obtener todos los clientes
console.log(await clientes.findClientes());

// Actualizar el rol de un usuario
console.log(await clientes.actualizarRolUsuario('id', 'Usuario VIP'));


Documentación de las Funciones del Código
Peliculas.js
getAllFilmsAvailable()

Descripción: Obtiene todas las películas disponibles.
Entrada: Ninguna
Salida: Promise<Array<Object>> - Array de objetos, cada uno representando una película disponible.
getAllDetailsFilms(id)

Descripción: Obtiene los detalles de una película por ID.
Entrada: id: string - ID de la película.
Salida: Promise<Object> - Objeto con los detalles de la película especificada por el ID.
Funciones.js
reservarAsientos(id, asientos)

Descripción: Reserva asientos para una función.
Entrada:
id: string - ID de la función.
asientos: Array<string> - Array de códigos de asiento.
Salida: Promise<Object> - Resultado de la reserva de asientos.
findAvailableBoletas(id)

Descripción: Encuentra boletos disponibles para una función.
Entrada: id: string - ID de la función.
Salida: Promise<Array<Object>> - Array de objetos representando boletos disponibles.
cancelarReserva(id, asientos)

Descripción: Cancela la reserva de asientos.
Entrada:
id: string - ID de la función.
asientos: Array<string> - Array de códigos de asiento.
Salida: Promise<Object> - Resultado de la cancelación de la reserva.
Clientes.js
findClientes()

Descripción: Obtiene todos los clientes.
Entrada: Ninguna
Salida: Promise<Object> - Objeto con el estado y un array de documentos de clientes.
verificarTarjetaVIP(id, numeroTarjeta)

Descripción: Verifica la validez de una tarjeta VIP.
Entrada:
id: string - ID del cliente.
numeroTarjeta: string - Número de la tarjeta VIP.
Salida: Promise<Object> - Objeto con el estado y el mensaje de la verificación de la tarjeta VIP.
crearUsuario(nombre, apellido, nickname, email, telefono, contrasena, categoria)

Descripción: Crea un nuevo usuario en la base de datos.
Entrada:
nombre: string - Nombre del usuario.
apellido: string - Apellido del usuario.
nickname: string - Apodo del usuario.
email: string - Correo electrónico del usuario.
telefono: string - Número de teléfono del usuario.
contrasena: string - Contraseña del usuario (encriptada).
categoria: string - Categoría del usuario.
Salida: Promise<Object> - Objeto con el estado y el mensaje de la creación del usuario.
obtenerDetallesUsuario(id)

Descripción: Obtiene la información detallada de un usuario por su ID.
Entrada: id: string - ID del usuario.
Salida: Promise<Object> - Objeto con el estado, el mensaje y los detalles del usuario.
actualizarRolUsuario(nombre, nuevoRol)

Descripción: Permite la actualización del rol de un usuario.
Entrada:
nombre: string - Nombre del usuario.
nuevoRol: string - Nuevo rol del usuario.
Salida: Promise<Object> - Objeto con el estado y el mensaje de la actualización del rol del usuario.
2. Compra de Boletos:
   - **API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.
   - **API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.
3. Asignación de Asientos:
   - **API para Reservar Asientos:** Permitir la selección y reserva de asientos para una proyección específica.
   - **API para Cancelar Reserva de Asientos:** Permitir la cancelación de una reserva de asiento ya realizada.
4. Descuentos y Tarjetas VIP:
   - **API para Aplicar Descuentos:** Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.
   - **API para Verificar Tarjeta VIP:** Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.
5. Roles Definidos:**Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.**Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.**Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP.**API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).**API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.**API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).**API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).
6. Compras en Línea:
   - **API para Procesar Pagos:** Permitir el procesamiento de pagos en línea para la compra de boletos.
   - **API para Confirmación de Compra:** Enviar confirmación de la compra y los detalles del boleto al usuario.

### **Requisitos Técnicos**

- **Base de Datos:** Utilizar MongoDB para el almacenamiento de datos relacionados con películas, boletos, asientos, usuarios y roles.
- **Autenticación:** Implementar autenticación segura para el acceso a las APIs, utilizando roles de usuario para determinar los permisos y accesos (por ejemplo, usuarios VIP y usuarios estándar).
- **Autorización de Roles:** Asegurar que las APIs y las operaciones disponibles estén adecuadamente restringidas según el rol del usuario (por ejemplo, aplicar descuentos solo a usuarios VIP).
- **Documentación:** Proveer una documentación clara y completa para cada API, describiendo los endpoints, parámetros, y respuestas esperadas.
- **Recursos**
  - ![](https://i.ibb.co/SRdNPRr/draw-SQL-image-export-2024-07-25.png)


mongodb://mongo:gvGQwlAqcXMhHBJKwanFlyKlizZZVLxA@monorail.proxy.rlwy.net:25078/


mongodb://mongo:llyfGdBqEGUyIBdNBuygTmoPHBesrxjq@mongodb.railway.internal:27017/
