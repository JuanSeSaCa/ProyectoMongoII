
const { Asientos } = require('./server/model/asientosModel');
const asientosModel = new Asientos();

/**
 
Función para listar todos los asientos y mostrar los resultados en la consola.*/
const testGetSeats = () => {
    asientosModel.findAsientos()
        .then(asientos => {
            console.log("Asientos:", asientos);
        })
        .catch(error => {
            console.error("Error al recuperar asientos:", error.message);
        });
};

// Llamar a la función de prueba
testGetSeats();