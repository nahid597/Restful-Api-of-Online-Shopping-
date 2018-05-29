var express = require('express');

const mongoose = require('mongoose');

const authcheck = require('../middleware/check-auth');

const Order = require('../model/order');

const controlall = require('../controller/orders')

var router = express.Router();

router.get('/', authcheck, controlall.control_all);


router.post('/', authcheck, controlall.creat_all_order);

router.get('/:orderId', authcheck, controlall.get_fixed_order);

router.delete('/:orderId', authcheck, controlall.delete_order);



module.exports = router;