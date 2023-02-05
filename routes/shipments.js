var express = require('express');
var router = express.Router();
var Shipment = require('../models/Shipment');
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

router.get('/', function(req, res) {
  var creator_id = getUserId(req.header('Authorization'));
  Shipment.find({creator_id: creator_id})
      .exec()
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.json(err);
      })
  }
);

router.post('/', function(req, res){ // create
  var shipment = new Shipment();
  shipment.payer = req.body.payer;
  shipment.creator_id =  getUserId(req.header('Authorization'));
  shipment.parcels = req.body.parcels;
  shipment.sender_address = req.body.sender_address;
  shipment.receiver_adress = req.body.receiver_adress;
  shipment.service = req.body.service;
  shipment.save()
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.json(err);
    })
});

router.get('/:id', function(req, res){
  var creator_id = getUserId(req.header('Authorization'));
  Shipment.findOne({_id: req.params.id, creator_id: creator_id})
      .exec()
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.json(err);
      })
});

router.post('/:id', async function(req, res){ // update
  try {
    var creator_id = getUserId(req.header('Authorization'));
    var shipment = await Shipment.findOne({_id: req.params.id, creator_id: creator_id});
    shipment.payer = req.body.payer;
    shipment.creator_id = creator_id;
    shipment.parcels = req.body.parcels;
    shipment.sender_address = req.body.sender_address;
    shipment.receiver_adress = req.body.receiver_adress;
    shipment.service = req.body.service;
    await shipment.save();
    res.json(shipment);
  } catch(e) {
    res.json(e);
  }
});

router.delete('/:id', function(req, res){
  var creator_id = getUserId(req.header('Authorization'));
  Shipment.deleteOne({_id: req.params.id || '', creator_id: creator_id})
  .exec()
  .then(doc => {
    res.json(doc);
  })
  .catch(err => {
    res.json(err);
  })
});

module.exports = router;
