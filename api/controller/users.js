const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../model/user');


exports.user_signup = (req, res, next) => {

    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(201).json({
                    message: "mail exists"
                })
            } else {

                password: bcrypt.hash(req.body.password, 10, (err, hash) => {

                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    meassage: "user created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });

                    }

                });

            }
        })
};

exports.user_login = (req, res, next) => {

    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Email don't match"
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        meassage: "Password is wrong"
                    });
                }

                if (result) {

                    const token = jwt.sign({

                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: '1h'
                    });
                    return res.status(200).json({
                        meassage: "Authrozation successfully",
                        token: token
                    });
                }

                res.status(401).json({
                    meassage: "Auth fail"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(401).json({
                error: err
            });
        });
};

exports.user_delete = (req, res, next) => {

    const id = req.params.userId;
    User.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "delete successfully"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({
                error: err
            });
        });

};