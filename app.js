const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRouter = require('./api/router/product');
const oderstRouter = require('./api/router/orders');
const userRouter = require('./api/router/users');

// connect mongodb allas

mongoose.connect('mongodb://online-shop:' + process.env.MONGO_ATLAS_PW + '@online-shop-shard-00-00-2bda4.mongodb.net:27017,online-shop-shard-00-01-2bda4.mongodb.net:27017,online-shop-shard-00-02-2bda4.mongodb.net:27017/test?ssl=true&replicaSet=online-shop-shard-0&authSource=admin&retryWrites=false');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handle cors error

app.use((req, res, next) => {

    res.header('Access-Conteol-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin,X-Requested-with,Content-type,Accept,Authorizarion');

    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/product', productRouter);
app.use('/orders', oderstRouter);
app.use('/user', userRouter);


app.use((req, res, next) => {

    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {

    res.status(error.status || 500);

    res.json({

        error: {
            message: error.message
        }
    });
});


module.exports = app;
