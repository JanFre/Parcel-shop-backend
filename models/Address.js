var mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    person: {type: String, required: false},
    company: {type: String, required: false}, // one of person/company is required
    street_nrs: {type: String, required: true}, 
    postal_code: {type: String, required: true},
    city: {type: String, required: true},
    country_code: {type: String, required: true}, // Alpha-2 ISO-3166-1 code 
});

module.exports = addressSchema;
