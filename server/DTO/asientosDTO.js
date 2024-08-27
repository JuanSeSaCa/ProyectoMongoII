/**
 * Clase `AsientosDTO`
 * 
 * Representa el objeto de transferencia de datos para los asientos.
 * 
 * @class
 */
class AsientosDTO {
    /**
     * Crea una instancia de `AsientosDTO`.
     * 
     * @param {Object} asientoData - Objeto con los datos del asiento.
     * @param {string} asientoData.id - El identificador único del asiento.
     * @param {string} asientoData.codigo - El código del asiento.
     * @param {string} asientoData.estado - El estado del asiento (e.g., 'disponible', 'reservado').
     * @param {string} asientoData.idLugar - El identificador del lugar o sala al que pertenece el asiento.
     */
    constructor({ id, codigo, estado, idLugar }) {
        this.id = id;
        this.codigo = codigo;
        this.estado = estado;
        this.idLugar = idLugar;
    }

    /**
     * Método estático para crear un DTO a partir de un objeto de datos de asiento.
     * 
     * @param {Object} asientoData - Objeto con los datos del asiento.
     * @returns {AsientosDTO} Una nueva instancia de `AsientosDTO`.
     */
    static fromDatabase(asientoData) {
        return new AsientosDTO({
            id: asientoData._id.toString(), // Convierte ObjectId a string
            codigo: asientoData.codigo,
            estado: asientoData.estado,
            idLugar: asientoData.id_lugar.toString() // Convierte ObjectId a string
        });
    }

    /**
     * Método estático para convertir un array de documentos de asientos a DTOs.
     * 
     * @param {Array<Object>} asientosArray - Arreglo de documentos de asientos.
     * @returns {Array<AsientosDTO>} Arreglo de instancias de `AsientosDTO`.
     */
    static fromDatabaseArray(asientosArray) {
        return asientosArray.map(asiento => AsientosDTO.fromDatabase(asiento));
    }
}

module.exports = AsientosDTO;
