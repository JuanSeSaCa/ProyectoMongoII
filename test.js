// test.js
import { Clientes } from "./js/modules/cliente.js";

(async () => {
    let clientes = new Clientes();
    console.log(clientes.obtenerDetallesUsuario); // Debería mostrar [Function: obtenerDetallesUsuario]
})();
