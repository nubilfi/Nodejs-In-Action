'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Photo = require('../models/photo');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/photos/');
    },
    filename: function (req, file, callback) {
        let originalname = file.originalname;
        let extension = originalname.split(".");
        let filename = Date.now() + '.' + extension[extension.length-1];
        callback(null, filename);
    }
});

const upload = multer({
    storage : storage,
    limits: { fileSize: 100000, files: 1 }
}).single('image');

// crete an array that will act as faux/fake database
// const photos = [];
// photos.push({
//     name: 'Node.js Logo',
//     path: 'https://nodejs.org/static/images/logos/nodejs-green.png'
// });
// photos.push({
//     name: 'Ryan Speaking',
//     path: 'https://nodejs.org/static/legacy/images/ryan-speaker.jpg'
// });

// get photos listing
router.get('/', function (req, res, next) {
    Photo.find({}, function (err, photos) {
        if (err) throw err;
        res.render('photos/index', { title: 'Photos', items: photos });
    });
});

router.get('/:id/download', function (req, res, next) {
    let id = req.params.id;

    Photo.findById(id, function (err, photo) {
        if (err) throw err;

      	let dataSrc = photo.path.split('/');
      	let fileSrc = 'public/photos/' + dataSrc[2];

      	let src = fs.createReadStream(fileSrc);

      	src.pipe(res);

        // res.download(photo.path);            to download the image
    });
});

// post a photo to database
router.get('/upload', function (req, res, next) {
    res.render('photos/upload', { title: 'Photo Upload' });
});

router.post('/upload', upload, function (req, res, next) {
    console.log(req.body.name);
    console.log(req.file);

    let item = new Photo({
        name: req.body.name,
        path: req.file.path
    });

    item.save(function (err) {
        if (err) throw err;
        res.redirect('/photos');
    });
});

module.exports = router;
