const Connect = require("../index.js");
const { ObjectId } = require("mongodb");

/**
 * Clase `Asientos`
 * 
 * Maneja las operaciones relacionadas con los asientos en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
module.exports = class Asientos extends Connect {
    static instance;

    constructor() {
        if (Asientos.instance) {
            return Asientos.instance;
        }
        super();
        this.collection = this.db.collection('funciones');
        Asientos.instance = this;
    }

    /**
     * Recupera todos los asientos disponibles en la base de datos.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos que representan los asientos.
     */
    async findAsientos() {
        try {
            // Convertir la agregación a un array de resultados
            return await this.collection.aggregate([
                {
                    $match: {
                        id_pelicula: new ObjectId("64dfccf8c2adf5e3a72c0001"),
                        day: "Monday"
                    }
                },
                {
                    $lookup: {
                        from: "salas",
                        localField: "id_sala",
                        foreignField: "_id",
                        as: "roomDetails"
                    }
                },
                {
                    $unwind: "$roomDetails"
                },
                {
                    $project: {
                        date: {
                            $concat: [
                                {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "01"] }, then: "Enero" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "02"] }, then: "Febrero" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "03"] }, then: "Marzo" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "04"] }, then: "Abril" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "05"] }, then: "Mayo" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "06"] }, then: "Junio" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "07"] }, then: "Julio" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "08"] }, then: "Agosto" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "09"] }, then: "Septiembre" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "10"] }, then: "Octubre" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "11"] }, then: "Noviembre" },
                                            { case: { $eq: [{ $dateToString: { format: "%m", date: "$Date_inicio" } }, "12"] }, then: "Diciembre" }
                                        ],
                                        default: "Desconocido"
                                    }
                                },
                                " ",
                                { $dateToString: { format: "%d", date: "$Date_inicio" } }  // Día
                            ]
                        },
                        day: 1,
                        startTime: { $dateToString: { format: "%H:%M:%S", date: "$Date_inicio" } },
                        endTime: { $dateToString: { format: "%H:%M:%S", date: "$Date_fin" } },
                        price: "$roomDetails.precio_base",
                        bookedSeats: {
                            $map: {
                                input: "$Asientos_reservados",
                                as: "seat",
                                in: "$$seat.codigo_asiento"
                            }
                        },
                        AllSeats: {
                            $map: {
                                input: "$roomDetails.asientos",
                                as: "seat",
                                in: {
                                    seat: "$$seat.codigo_asiento",
                                    status: {
                                        $cond: [
                                            { $in: ["$$seat.codigo_asiento", "$Asientos_reservados.codigo_asiento"] },
                                            "reserved",
                                            "available"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: { startTime: 1 }
                }
            ]).toArray();  // Asegúrate de llamar a .toArray() para obtener los resultados de la agregación
        } catch (error) {
            console.error(`Error al recuperar asientos: ${error.message}`);
            // Log additional information for debugging
            console.error(error.stack);
            throw new Error('No se pudieron recuperar los asientos.');
        }
    }
}