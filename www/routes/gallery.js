var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Gallery = require('../../models/gallery.js');

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
  Gallery.find(function (err, galleries) {
    if (err) return next(err);
    res.json(galleries);
  });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
  Gallery.findById(req.params.id, function (err, gallery) {
    if (err) return next(err);
    res.json(gallery);
  });
});

/* SAVE BOOK */
router.post('/', function(req, res, next) {
  Gallery.create(req.body, function (err, gallery) {
    if (err) return next(err);
    res.json(gallery);
  });
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
  Gallery.findByIdAndUpdate(req.params.id, req.body, function (err, gallery) {
    if (err) return next(err);
    res.json(gallery);
  });
});

/* DELETE BOOK */
router.delete('/:id', function(req, res, next) {
  Book.findByIdAndRemove(req.params.id, req.body, function (err, gallery) {
    if (err) return next(err);
    res.json(gallery);
  });
});

module.exports = router;