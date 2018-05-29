const mongoose = require('mongoose');

const Order = require('../model/order');


exports.control_all = (req, res, next) => {
    Order.find()
        .select('product quentity _id')
        .populate('product', 'name')
        .exec()
        .then(result => {
            console.log(result);
            res.status(201).json({
                count: result.length,

                orders: result.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quentity: doc.quentity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            });
        });
};

exports.creat_all_order = (req, res, next) => {

    // take body which are send by user

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quentity: req.body.quentity,
        product: req.body.productId

    });

    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            });
        });

};

exports.get_fixed_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
        .select('product quentity _id')
        .populate('product')
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                order: doc,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            });
        });

};

exports.delete_order = (req, res, next) => {

    Order.remove({
            _id: req.params.orderId
        })
        .exec()
        .then(result => {

            res.status(201).json({
                message: "order delete",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {
                        product: "Id",
                        quentity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            });
        });
};
