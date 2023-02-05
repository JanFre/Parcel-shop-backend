var mongoose = require('mongoose');
var addressSchema = require("./Address");

const Settings = mongoose.Schema({
    environment: {
        type: String,
        enum: ['PRODUCTION','DEMO'],
        required: true
    },
    courier_API_URL: {type: String, required: true},
    sender_address: {type: addressSchema, required: true},
    sender_business_unit: {type: String, required: true},
    api_login: {type: String, required: true},
    api_password: {type: String, required: true},
    main_customer_id: {type: String, required: true},
    additional_customer_id: {type: String, required: false},
    creator_id: {type: String, required: true}
});

module.exports = mongoose.model('Settings', Settings);
