var mongoose = require('mongoose');
var addressSchema = require("./Address");
// const serviceSchema = new Schema({ any: {} });

const parcelSchema = mongoose.Schema({
    tracking_number: {type: String, required: false}, // should be set when the parcel is created or when Meta-API provided it
    weight: {type: Number, required: true},
    content: {type: String, required: false}, // required only for international shipments
    technical_id: {type: String, required: false}, // database id of the parcel
    parcel_ref_1: {type: String, required: false},
    parcel_ref_2: {type: String, required: false},
    parcel_ref_3: {type: String, required: false},
    dim_x: {type: Number, required: false},
    dim_y: {type: Number, required: false},
    dim_z: {type: Number, required: false}
});

const shipmentSchema = mongoose.Schema({
    payer: {type: String, required: true}, // carrier customer's id
    company_id: {type: String, required: false}, // sender company database id
    creator_id: {type: String, required: true}, // database id of the user that created the shipment
    parcels: {type: [parcelSchema], required: true}, // also at least one parcel is required
    technical_id: {type: String, required: false}, // database id of the shipment
    ref_1: {type: String, required: false}, // business id1 of the parcel
    ref_2: {type: String, required: false}, // business id2 of the parcel
    ref_3: {type: String, required: false}, // business id3 of the parcel
    sender_address: {type: addressSchema, required: true},
    receiver_adress: {type: addressSchema, required: true},
    service: {type: String, required: false} // TODO {type: serviceSchema, required: false}
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;
