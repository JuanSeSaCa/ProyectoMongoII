const { ObjectId } = require("mongodb");

/**
 * Verifica si el asiento está disponible.
 * 
 * @param {Array<Object>} asientos - Lista de asientos en la sala.
 * @param {string} codigo_asiento - Código del asiento a verificar.
 * @returns {Object|null} El asiento si está disponible, o null si no está disponible.
 */
function validarAsientoDisponible(asientos, codigo_asiento) {
    const asiento = asientos.find(asiento => asiento.codigo_asiento === codigo_asiento);
    return asiento && asiento.estado === 'available' ? asiento : null;
}

/**
 * Calcula el precio total del boleto.
 * 
 * @param {string} precio_base - Precio base de la sala.
 * @param {string} tipo_asiento - Tipo de asiento.
 * @returns {string} El precio total del boleto en formato "XX.XXX COP".
 */
function calcularPrecioTotal(precio_base, tipo_asiento) {
    let precioTotal = parseFloat(precio_base.replace(' COP', '').replace('.', ''));
    if (tipo_asiento === 'preferencial') {
        precioTotal *= 1.25; // Aumento del 25%
    }
    return precioTotal.toFixed(2) + ' COP';
}

/**
 * Valida la entrada para crear un boleto.
 * 
 * @param {Object} params - Parámetros necesarios para crear el boleto.
 * @param {Object} sala - Datos de la sala.
 * @param {Object} funcion - Datos de la función.
 * @returns {Object} Resultado de la validación con un mensaje de error si existe.
 */
function validarEntradaBoleto(params, sala, funcion) {
    const { _id_cliente, id_pelicula, id_sala, Date_compra, asiento_reservado } = params;

    // Verificar si la sala y la función existen
    if (!sala) {
        return { error: 'Sala no encontrada.' };
    }
    if (!funcion) {
        return { error: 'Función no encontrada.' };
    }

    // Verificar disponibilidad del asiento
    const asiento = validarAsientoDisponible(sala.asientos, asiento_reservado);
    if (!asiento) {
        return { error: 'Asiento no disponible o inválido.' };
    }

    return { error: null, asiento };
}

module.exports = {
    validarAsientoDisponible,
    calcularPrecioTotal,
    validarEntradaBoleto
};
