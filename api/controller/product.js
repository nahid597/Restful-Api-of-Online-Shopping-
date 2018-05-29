const mongoose = require('mongoose');
const Product = require('../model/products');


exports.get_all_product = (req, res, next) => {

    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                length: docs.length,
                product: docs.map(doc => {

                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,

                        request: {
                            type: "GET",
                            url: "http://localhost:3000/product/" + doc._id
                        }

                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            });
        });

};

exports.create_product = (req, res, next) => {

    // take body which are send by user

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    // product save in mongodb

    product.save().then(result => {
        console.log(result);

        res.status(200).json({

            message: "object created",
            createProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,

                request: {
                    type: "GET",
                    url: "http://localhost:3000/product/" + result._id
                }
            }
        });
    }).catch(error =>
        console.log(error));

};

exports.get_fixed_product = (req, res, next) => {

    const id = req.params.productid;

    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {

            console.log("read from database: ", doc);

            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/product"
                    }
                });
            } else {
                res.status(404).json({
                    message: "data is not exist in database"
                })
            }

        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};

exports.update_product = (req, res, next) => {
    const id = req.params.productid;
    const updateopr = {};

    for (const opr of req.body) {
        updateopr[opr.setname] = opr.value;
    }

    Product.update({
            _id: id
        }, {
            $set: updateopr
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "updated statement",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/product/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            });
        });

};

exports.delete_product = (req, res, next) => {
    const id = req.params.productid;
    console.log(id);

    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "produt deleted",
                request: {

                    type: "POSt",
                    url: "http://localhost:3000/product",
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
