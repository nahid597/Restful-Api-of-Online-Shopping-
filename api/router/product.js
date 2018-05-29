var express = require('express');

var router = express.Router();

const mongoose = require('mongoose');

const authcheck = require('../middleware/check-auth');

// upload file or image
const multer = require('multer');



// const storage = multer.diskStorage({

//     nahid: "nahid",

//     destrination: function(req, file, cb) {
//         cb(null, './uploads/');
//         //cb(null, require('path').join(__dirname, '/uploads/'));
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

const upload = multer({ dest: 'uploads' });

const controlproduct = require('../controller/product');

const Product = require('../model/products');

// get all product..

router.get('/', controlproduct.get_all_product);

// post any product

router.post('/', authcheck, upload.single('productImage'), controlproduct.create_product);

// get fixed product 

router.get('/:productid', authcheck, controlproduct.get_fixed_product);

// update any product 

router.patch('/:productid', authcheck, controlproduct.update_product);

// delete any product 

router.delete('/:productid', authcheck, controlproduct.delete_product);


module.exports = router;