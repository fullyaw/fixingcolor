var mongoose = require('mongoose');

var GallerySchema = new mongoose.Schema({
  title: String,
  description: String,
  enabled: Boolean,
  gallery_items:[
      {type: mongoose.Schema.Types.ObjectId, ref: 'GalleryItem'}
  ],
  created_date: { type: Date, default: Date.now },  
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', GallerySchema);