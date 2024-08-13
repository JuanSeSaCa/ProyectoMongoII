import { connect } from "../../helper/db/connect.js";
import { ObjectId } from "mongodb";

export class Asientos extends connect {
    constructor() {
        if (typeof Asientos.instance === "object") {
            return Asientos.instance;
        }
        super();
        this.collection = this.db.collection('asientos');
        Asientos.instance = this;
        return this;
    }
    async findAsientos() {
        let res = await this.collection.find({}).toArray();
        return res;
    }
}