var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var GalleryItem = require('../../models/gallery-item.js');

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
  GalleryItem.find(function (err, items) {
    if (err) return next(err);
    res.json(items);
  });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

/* SAVE BOOK */
router.post('/', function(req, res, next) {
  GalleryItem.create(req.body, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
  GalleryItem.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

/* DELETE BOOK */
router.delete('/:id', function(req, res, next) {
  GalleryItem.findByIdAndRemove(req.params.id, req.body, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

module.exports = router;