const { ObjectId } = require("mongodb");

/**
 * Verifica si una función existe.
 * 
 * @param {Object} funcion - La función a validar.
 * @throws {Error} Si la función no existe.
 */
function asegurarFuncionExiste(funcion) {
    if (!funcion) {
        throw new Error('La función ingresada no existe, por favor revíselo nuevamente.');
    }
}

/**
 * Verifica si un lugar (sala) existe.
 * 
 * @param {Object} lugar - El lugar a validar.
 * @throws {Error} Si el lugar no existe.
 */
function asegurarLugarExiste(lugar) {
    if (!lugar) {
        throw new Error('La sala especificada no existe, por favor revíselo nuevamente.');
    }
}

/**
 * Verifica si hay asientos disponibles en la sala especificada.
 * 
 * @param {Array} asientos - Los asientos a validar.
 * @throws {Error} Si no hay asientos disponibles.
 */
function asegurarAsientosDisponibles(asientos) {
    if (asientos.length === 0) {
        throw new Error('Los asientos para la sala especificada no existen.');
    }
}

/**
 * Verifica si los asientos seleccionados están disponibles y existen en la sala.
 * 
 * @param {Array} todosAsientos - Todos los asientos de la sala.
 * @param {Set} asientosOcupados - Los asientos que ya están ocupados.
 * @param {Array} asientosSeleccionados - Los asientos seleccionados por el usuario.
 * @throws {Error} Si un asiento no existe o ya está reservado.
 */
function asegurarAsientosParaReservar(todosAsientos, asientosOcupados, asientosSeleccionados) {
    asientosSeleccionados.forEach(codigo => {
        const asiento = todosAsientos.find(a => a.codigo_asiento === codigo);
        if (!asiento) {
            throw new Error(`El asiento ${codigo} no existe en la sala.`);
        }
        if (asientosOcupados.has(codigo)) {
            throw new Error(`El asiento ${codigo} ya está reservado.`);
        }
    });
}

/**
 * Verifica si los asientos a cancelar están efectivamente reservados.
 * 
 * @param {Set} asientosOcupados - Los asientos que ya están ocupados.
 * @param {Array} asientosCancelar - Los asientos que se desean cancelar.
 * @throws {Error} Si un asiento no está reservado.
 */
function asegurarAsientosParaCancelar(asientosOcupados, asientosCancelar) {
    asientosCancelar.forEach(codigo => {
        if (!asientosOcupados.has(codigo)) {
            throw new Error(`El asiento ${codigo} no está reservado para esta función.`);
        }
    });
}

module.exports = {
    asegurarFuncionExiste,
    asegurarLugarExiste,
    asegurarAsientosDisponibles,
    asegurarAsientosParaReservar,
    asegurarAsientosParaCancelar,
};