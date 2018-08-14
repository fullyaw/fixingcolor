var mongoose = require('mongoose');

var GalleryItemSchema = new mongoose.Schema({
  image_corrected: {data: Buffer, contentType: String},	
  image_original: {data: Buffer, contentType: String},
  src_corrected: String,
  src_original: String,
  width: Number,
  height: Number,      
  small_image_corrected: {data: Buffer, contentType: String},	
  small_image_original: {data: Buffer, contentType: String},
  small_src_corrected: String,
  small_src_original: String, 
  small_width: Number,
  small_height: Number,      
  medium_image_corrected: {data: Buffer, contentType: String},	
  medium_image_original: {data: Buffer, contentType: String},
  medium_src_corrected: String,
  medium_src_original: String,
  medium_width: Number,
  medium_height: Number,    
  type: String, 
  title: String,
  description: String,
  on_slider: { type: Boolean, default: false },
  on_homepage: { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 },
  filters: { type: String, default: ''},  
  created_date: { type: Date, default: Date.now },  
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);