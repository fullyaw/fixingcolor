var express = require('express');
var async = require('async');
var path = require('path');
var mv = require('mv');
var rimraf = require('rimraf');
var router = express.Router();
var mongoose = require('mongoose');
var thumb = require('node-thumbnail').thumb;
var sizeOf = require('image-size');
var mime = require('mime-types')
var fs = require('fs');
var multer = require('multer');
var formidable = require('formidable');
var Gallery = require('../../models/gallery.js');
var GalleryItem = require('../../models/gallery-item.js');
var User = require('../../models/user.js');
var passport = require('passport');
var config = require('../../config/database');
require('../../config/passport')(passport);
var jwt = require('jsonwebtoken');

const PATH = '../../uploads/';
const productionPath = path.resolve(__dirname, PATH);
const developmentPath = 'c:\\Users\\sn3ll\\Desktop\\ColorNinja\\uploads';

console.log('Using Production Path:' + productionPath);

const storage = multer.diskStorage({
  destination: async function(req, file, cb) {
    try {
      const dirPath = path.resolve(__dirname, PATH);
      const dirExist = await fs.exists(dirPath);
      if (dirExist === false) {
        await fs.mkdir(dirPath);
      }
      cb(null, dirPath);
    } catch (E) {
      cb(E);
      console.log(E);
    }
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024*1024*10, 
    files: 10
  }
});

/* SIGN USER UP */
router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    //newUser.save(function(err) {
    //  if (err) {
    //    return res.json({success: false, msg: 'Username already exists.'});
    //  }
      res.json({success: true, msg: 'Successful created new user.'});
    //});
  }
});

/* SIGN USER IN */
router.post('/signin', function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) next(err);

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

/* GET ALL GALLERYS */
router.get('/gallery', function(req, res, next) {
  Gallery.find(function (err, galleries) {
    if (err) return next(err);
    res.json(galleries);
  });
});

/* GET SINGLE GALLERY BY ID */
router.get('/gallery/:id', function(req, res, next) {
  Gallery.findById(req.params.id, function (err, gallery) {
    if (err) return next(err);
    console.log(gallery);
    res.json(gallery);
  });
});

/* SAVE GALLERY */
router.post('/gallery', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {  
    console.log('creating gallery');
    Gallery.create(req.body, function (err, gallery) {
      if (err) return next(err);

      // Create root folder
      let dirPath = path.resolve(__dirname, PATH + '/' + gallery._id + '/');
      let dirExist = false;
      fs.access(dirPath, (err) => {
        if (!err) {
          console.log(filePath + ' exists');
          dirExist = true;
        }
      });      

      console.log(dirPath);
      console.log(dirExist);

      if (dirExist === false) {
        fs.mkdir(dirPath);

        let smallThumbsPath = path.resolve(__dirname, dirPath + '/small-thumbs/')
        let mediumThumbsPath = path.resolve(__dirname, dirPath + '/medium-thumbs/')        
        let dirSmallExist = false;        
        let dirMediumExist = false;

        fs.access(smallThumbsPath, (err) => {
          if (!err) {
            console.log(smallThumbsPath + ' exists');
            dirSmallExist = true;
          }
        });

        fs.access(mediumThumbsPath, (err) => {
          if (!err) {
            console.log(mediumThumbsPath + ' exists');
            dirMediumExist = true;
          }
        });         

        console.log(smallThumbsPath);

        if (dirSmallExist === false) {
          fs.mkdir(smallThumbsPath, function(err) {
            if (err) {
              console.log('created: ' + smallThumbsPath);
            }
          });
        }        

        console.log(mediumThumbsPath);

        if (dirMediumExist === false) {
          fs.mkdir(mediumThumbsPath, function(err) {
            if (err) {
              console.log('created: ' + mediumThumbsPath);
            }
          });
        }                
      }

      res.json(gallery);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }    
});

/* UPDATE GALLERY */
router.put('/gallery/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {  
    Gallery.findByIdAndUpdate(req.params.id, req.body, function (err, gallery) {
      if (err) return next(err);
      res.json(gallery);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }    
});

/* DELETE GALLERY */
router.delete('/gallery/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {  
    Gallery.findByIdAndRemove(req.params.id, req.body, function (err, gallery) {
      if (err) return next(err);
      gallery.gallery_items.forEach(function(elm, idx) {
        GalleryItem.findByIdAndRemove(req.params.id, req.body, function (err, item) {
          if (err) return next(err);

          // Delete folder          
          rimraf(path.resolve(__dirname, PATH + '/' + req.params.id), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + __dirname, PATH + '/' + req.params.id);
            }
          });

          res.json(gallery);
        });
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }    
});

/* GET ALL GALLERYITEMS BY ON_HOMEPAGE FLAG */
router.get('/home', function(req, res, next) {  
  GalleryItem.find({ on_homepage:true }, '_id title description', function(err, items) {
    if (err) return next(err);
    res.json(items);
  });
  //}).select('-image-original -medium-image-original -small-image-original -image-corrected -medium-image-corrected -small-image-corrected');
});

/* GET ALL GALLERYITEMS BY ON_SLIDESHOW FLAG */
router.get('/home/hero',  function(req, res, next) {  
  GalleryItem.find({ on_slider:true }, '_id title description', function(err, items) {
    if (err) return next(err);
    res.json(items);
  });
  //}).select('-image-original -medium-image-original -small-image-original -image-corrected -medium-image-corrected -small-image-corrected');
});

/* GET ALL GALLERYITEMS BY GALLERYID */
router.get('/gallery/:id/gallery-item', function(req, res, next) {  
  Gallery.findById(req.params.id, function (err, item) {	    
    if (err) return next(err);
    if (item !== null && item.gallery_items) {
      res.json(item.gallery_items);
    } else {
      res.json([]);
    }
  }).populate('gallery_items').exec();
});

/* GET ALL GALLERYITEMS BY GALLERYID */
router.get('/gallery/:galleryId/gallery-item/:sortDirection/:pageIndex/:pageSize/:filter', function(req, res, next) {  
  Gallery.findById(req.params.galleryId, function (err, item) {      
    if (err) return next(err);
    if (item !== null && item.gallery_items) {
      let items = item.gallery_items.sort((l1, l2) => l1.id - l2.id);

      //if (req.params.filter) {
      //  items = items.filter(items => item.description.trim().toLowerCase().search(req.params.filter.toLowerCase()) >= 0 ||
      //                                 item.title.trim().toLowerCase().search(req.params.filter.toLowerCase()) >= 0);
      //}

      if (req.params.sortDirection == "desc") {
        items = items.reverse();
      }

      const initialPos = req.params.pageIndex * req.params.pageSize;
      const itemsPage = items.slice(initialPos, initialPos + req.params.pageSize);

      setTimeout(() => {
          res.status(200).json(itemsPage);
      },1000);      
    } else {
      res.json([]);
    }
  }).populate('gallery_items').exec();
});

/* GET SINGLE GALLERYITEM BY ID */
router.get('/gallery-item/:id', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

/* GET SINGLE GALLERYITEM IMAGE BY ID AND TYPE */
router.get('/gallery-item/:id/original', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    if (null !== item && item.src_original) sendFile(res, item.src_original);
    else res.send(200);
  });
});

router.get('/gallery-item/:id/corrected', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    if (null !== item && item.src_corrected) sendFile(res, item.src_corrected);
    else res.send(200);
  });
});

router.get('/gallery-item/:id/original/m', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    if (null !== item && item.medium_src_original) sendFile(res, item.medium_src_original);
    else res.send(200);
  });
});

router.get('/gallery-item/:id/corrected/m', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    if (null !== item && item.medium_src_corrected) sendFile(res, item.medium_src_corrected);
    else res.send(200);
  });
});

router.get('/gallery-item/:id/original/s', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    if (null !== item && item.small_src_original) sendFile(res, item.small_src_original);
    else res.send(200);
  });
});

router.get('/gallery-item/:id/corrected/s', function(req, res, next) {
  GalleryItem.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    if (null !== item && item.small_src_corrected) sendFile(res, item.small_src_corrected);
    else res.send(200);
  });
});

/* SAVE GALLERYITEM */
router.post('/gallery-item', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {  
    GalleryItem.create(req.body, function (err, item) {
      if (err) return next(err);
      res.json(item);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }        
});

/* UPDATE GALLERYITEM */
router.put('/gallery-item/:id', passport.authenticate('jwt', { session: false}),  function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {  
    GalleryItem.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
      if (err) return next(err);
      res.json(item);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }    
});


/* ADD CORRECTED FILE TO GALLERY ITEM */
router.post('/gallery/:galleryId/gallery-item/upload/:id', upload.any(), function(req, res, next) { 
  req.files.forEach(function (file, idx) {
    processImage(req, res, file.fieldname, file, function() {
      console.log('idx:' + idx);
      console.log('req.files.length-1:' + req.files.length-1);      
      if (idx == req.files.length-1) {
        console.log('get gallery');
        GalleryItem.findById(req.params.id, function (err, item) {
          if (err) { 
            return next(err);
          }
          console.log('found gallery');
          res.json(item);
        });
      }
    });
  });
});

/* PROCESS IMAGES */
processImage = function(req, res, imageType, file, callback) {
  try
  {
    GalleryItem.findById(req.params.id, function (err, item) {
      if (err) { 
        console.log(err);
        return next(err);
      }
      
      if (file) {
        console.log('Found file:' + file.path);

        //Move to {galleryId}
        let finalPath = path.dirname(file.path) + '\\' + req.params.galleryId + '\\' + path.basename(file.path); 
        mv(file.path, finalPath, {mkdirp: true}, function(err) {

          if (err) {
            console.log(err);
            return;
          }
        
          item.type = mime.lookup(finalPath);
        
          if (imageType == 'correctedFile') {
            item.src_corrected = finalPath;
            item.image_corrected.contentType = item.type;
            item.image_corrected.data = fs.readFileSync(finalPath);
          } else {
            item.src_original = finalPath;
            item.image_original.contentType = item.type;
            item.image_original.data = fs.readFileSync(finalPath);          
          }

          sizeOf(finalPath, function(err, dimensions) {
            if (dimensions) {
              item.width = dimensions.width;
              item.height = dimensions.height;            
            }
            console.log(dimensions);
          });

          let rootFileName = path.basename(finalPath);
          let rootPath = path.dirname(finalPath);
          let smallDestination = rootPath + '\\small-thumbs\\';
          let mediumDestination = rootPath + '\\medium-thumbs\\';

          console.log('creating small thumb');

          thumb({
            source: finalPath,
            destination: smallDestination,
            concurrency: 1,
            width: 150,
            prefix: '',
            suffix: ''          
          }).then(function() {

            if (imageType == 'correctedFile') {          
              item.small_src_corrected = smallDestination + rootFileName;
              item.small_image_corrected.data = fs.readFileSync(smallDestination + rootFileName);
              item.small_image_corrected.contentType = item.type;
            } else {
              item.small_src_original = smallDestination + rootFileName;
              item.small_image_original.data = fs.readFileSync(smallDestination + rootFileName);
              item.small_image_original.contentType = item.type;          
            }

            console.log('creating small thumb');

            thumb({
              source: finalPath,
              destination: mediumDestination,
              concurrency: 1,
              width: 300,
              prefix: '',
              suffix: ''          
            }).then(function() {
            
              if (imageType == 'correctedFile') {            
                item.medium_src_corrected = mediumDestination + rootFileName;
                item.medium_image_corrected.data = fs.readFileSync(mediumDestination + rootFileName);
                item.medium_image_corrected.contentType = item.type;
              } else {
                item.medium_src_original = mediumDestination + rootFileName;
                item.medium_image_original.data = fs.readFileSync(mediumDestination + rootFileName);
                item.medium_image_original.contentType = item.type;              
              }

              GalleryItem.findByIdAndUpdate(req.params.id, item, function (err, item) {
                console.log('updated gallery item');
                if (err) return next(err);
                callback();
              });      
            }).catch(function(e) {
              console.log('Error', e.toString());
            });
          }).catch(function(e) {
            console.log('Error', e.toString());
          });
        });
      } else {
        console.log('Did not find file');
      }
    });
  } 
  catch (ex)
  {
    next(ex);
  }
}
/* DELETE GALLERYITEM */
router.delete('/gallery/:galleryId/gallery-item/:id', passport.authenticate('jwt', { session: false}),  function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {    
    GalleryItem.findByIdAndRemove(req.params.id, req.body, function (err, item) {
      if (err) return next(err);
      Gallery.findById(req.params.galleryId, function (err, gallery) {
        if (err) return next(err);
        if (gallery) {
          var idx = -1;
          gallery.gallery_items.forEach(function(e,i){
            if (e !== null && e == req.params.galleryId) {
              idx = i;
            }
          });

          let orgFileName = gallery.gallery_items[idx].src_original;
          let corFileName = gallery.gallery_items[idx].src_corrected;

          let orgFileNameSm = gallery.gallery_items[idx].small_image_original;
          let corFileNameSm = gallery.gallery_items[idx].small_image_corrected;

          let orgFileNameMd = gallery.gallery_items[idx].medium_image_original;
          let corFileNameMd = gallery.gallery_items[idx].medium_image_corrected;

          gallery.gallery_items.splice(idx, 1);
          Gallery.findByIdAndUpdate(req.params.id, gallery, function (err, post) {
            if (err) return next(err);
          });        

          rimraf(orgFileName), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + orgFileName);
            }
          };

          rimraf(corFileName), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + corFileName);
            }
          };

          rimraf(orgFileNameSm), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + orgFileNameSm);
            }
          };

          rimraf(corFileNameSm), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + corFileNameSm);
            }
          };

          rimraf(orgFileNameMd), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + orgFileNameMd);
            }
          };

          rimraf(corFileNameMd), function(err){
            if (err) {
              console.log(err);
            } else {
              console.log('Deleted ' + corFileNameMd);
            }
          };


          res.json(item);
        }    
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }    
});

/* SEND EMAIL */
router.post('/sendEmail', function(req, res, next) {
  var user = process.env.mail_user;
  var pwd = process.env.mail_pwd;
  var server = process.env.mail_server;
  var port = process.env.mail_port;

  console.log('Got Mail Server Info:' + user + ' ' + pwd);

  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
   host: server,
   port: port,
   secure: false,
   auth: {
          user: user,
          pass: pwd
      }
  });

  const mailOptions = {
    from: req.body.email, // sender address
    to: config.email_to,
    subject: config.email_subject,
    html: req.body.message,
  };  

  transporter.sendMail(mailOptions, function (err, info) {
    if(err) {
      console.log(err)
      return res.status(500).send({success: false, msg: err});
    } else {
      console.log(info);
      return res.status(200).send({success: true, msg: info});       
    }
  });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

sendFile = function(res, filepath) {
  var env = process.env.NODE_ENV || 'dev';
  if (env == 'dev') {
    res.sendFile(filepath);
  } else {
    var prod_filepath = filepath.replace(developmentPath, productionPath);
    prod_filepath = prod_filepath.replace(/\\/g, '/');
    res.sendFile(prod_filepath);
  }  
}

router.use(function (err, req, res, next) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('404')
  }
});

module.exports = router;
