/**
 * Clase `BoletasDTO`
 * 
 * Representa el objeto de transferencia de datos para las boletas.
 * 
 * @class
 */
class BoletasDTO {
    /**
     * Crea una instancia de `BoletasDTO`.
     * 
     * @param {Object} boletaData - Objeto con los datos de la boleta.
     * @param {string} boletaData.id - El identificador único de la boleta.
     * @param {string} boletaData.codigo - El código de la boleta.
     * @param {string} boletaData.estado - El estado de la boleta (e.g., 'disponible', 'vendido').
     * @param {string} boletaData.precio - El precio de la boleta.
     * @param {string} boletaData.idFuncion - El identificador de la función a la que pertenece la boleta.
     */
    constructor({ id, codigo, estado, precio, idFuncion }) {
        this.id = id;
        this.codigo = codigo;
        this.estado = estado;
        this.precio = precio;
        this.idFuncion = idFuncion;
    }

    /**
     * Método estático para crear un DTO a partir de un objeto de datos de boleta.
     * 
     * @param {Object} boletaData - Objeto con los datos de la boleta.
     * @returns {BoletasDTO} Una nueva instancia de `BoletasDTO`.
     */
    static fromDatabase(boletaData) {
        return new BoletasDTO({
            id: boletaData._id.toString(), // Convierte ObjectId a string
            codigo: boletaData.codigo,
            estado: boletaData.estado,
            precio: boletaData.precio,
            idFuncion: boletaData.id_funcion.toString() // Convierte ObjectId a string
        });
    }

    /**
     * Método estático para convertir un array de documentos de boletas a DTOs.
     * 
     * @param {Array<Object>} boletasArray - Arreglo de documentos de boletas.
     * @returns {Array<BoletasDTO>} Arreglo de instancias de `BoletasDTO`.
     */
    static fromDatabaseArray(boletasArray) {
        return boletasArray.map(boleta => BoletasDTO.fromDatabase(boleta));
    }
}

module.exports = BoletasDTO;
