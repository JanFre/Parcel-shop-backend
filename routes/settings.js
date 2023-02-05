var express = require('express');
var router = express.Router();
var Settings = require('../models/Settings');
var jwt = require('jsonwebtoken');
var config = require('../config');

function getUserId(bearer) { 
  if (!bearer) {
    throw new Error('No authorization header');
  }
  bearer = bearer.replace('Bearer', '').trim();
  var decoded = jwt.verify(bearer, config.tokenSecret);
  return decoded.userId;
}

router.post('/', async function(req, res){ // add new
  try {
  var settings = new Settings();
  settings.creator_id = getUserId(req.header('Authorization'));
  var existingInstance = await Settings.findOne({environment: req.body.environment, creator_id: settings.creator_id});
  if (existingInstance) {
    throw new Error('Settings for this user and environment already exist!');
  }
  settings.environment = req.body.environment;
  settings.courier_API_URL = req.body.courier_API_URL;
  settings.sender_address = req.body.sender_address;
  settings.sender_business_unit = req.body.sender_business_unit;
  settings.api_login = req.body.api_login;
  settings.api_password = req.body.api_password;
  settings.main_customer_id = req.body.main_customer_id;
  settings.additional_customer_id = req.body.additional_customer_id;  
  await settings.save()
    .then(doc => {
      res.json(doc);
    })
  }  catch(e) {
    res.json(e);
  }
});

router.get('/:environment', function(req, res){
  var creator_id = getUserId(req.header('Authorization'));
  Settings.findOne({environment: req.params.environment, creator_id: creator_id})
      .exec()
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.json(err);
      })
});

router.post('/:environment', async function(req, res){ // update
  try {
    var creator_id = getUserId(req.header('Authorization'));
    var settings = await Settings.findOne({environment: req.params.environment, creator_id: creator_id});
    settings.environment = req.body.environment;
    settings.courier_API_URL = req.body.courier_API_URL;
    settings.sender_address = req.body.sender_address;
    settings.sender_business_unit = req.body.sender_business_unit;
    settings.api_login = req.body.api_login;
    settings.api_password = req.body.api_password;
    settings.main_customer_id = req.body.main_customer_id;
    settings.additional_customer_id = req.body.additional_customer_id;  
    await settings.save();
    res.json(settings);
  } catch(e) {
    res.json(e);
  }
});

module.exports = router;
