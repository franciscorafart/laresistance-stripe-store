require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const cryptoRandomString = require('crypto-random-string');


const cors = require('cors');
const path = require('path');
const { pool } = require('./config')

const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction? process.env.LIVE_STRIPE_SECRET_KEY: process.env.TEST_STRIPE_SECRET_KEY;

const stripe = require('stripe')(stripeKey);

const app = express();

app.use(bodyParser.json());

// Secure Cors
const origin = {
  origin: isProduction ? 'https://www.heroku.com/' : '*',
}
app.use(cors(origin));

// serves the built version of your react app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

AWS.config.update({
    accessKeyId: process.env.IAM_ACCESS_ID,
    secretAccessKey: process.env.IAM_SECRET,
    region: process.env.AWS_REGION,
});

const s3= new AWS.S3();

const getStripeIntent = async (amount, currency, paymentMethodId, customerEmail, dbAmount) => {
    if (!dbAmount || amount < dbAmount){
        // TODO: Figure out how to display the message
        throw "Product with the given price doesn't exist" 
    }

    const description = "La Resistance Media purchase - " + customerEmail

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100,
        currency: currency,
        payment_method_types: ['card'],
        description: description,
        receipt_email: customerEmail,
        payment_method: paymentMethodId,
        confirmation_method: 'automatic',
        // confirm: true
    });

    return await paymentIntent;
}

app.post('/get_intent', (req, res) => {
    const payload = req.body
    const { amount, currency, paymentMethodId, customerEmail, productId } = payload;
    
    let dbAmount = null;

    pool.query(`Select * from products where id=${productId}`, (error, results) => {
        if (error) {
            throw error;
        }

        const rows = results.rows;

        if (rows.length>0){
            const product  = rows[0];
            dbAmount = Number(product.price);
        }

        getStripeIntent(amount, currency, paymentMethodId, customerEmail, dbAmount).then( data => {
            const token = cryptoRandomString({length: 10, type: 'url-safe'});

            const state = { clientSecret: data.client_secret, token: token }
            const response = JSON.stringify(state);

            pool.query(`INSERT INTO transactions (email, product_id, token)VALUES('${customerEmail}', ${productId}, '${token}')`, (error, _) => {
                if (error) {
                    throw error;
                };
            });

            res.send(response);
        }).catch(e => res.json(JSON.stringify({"stripe_error": e})))
    })
});

app.post('/get_products', (req, res) => {
    pool.query('Select * from products', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});

app.post('/transaction_complete', (req, res) => {
    const payload = req.body;
    const { token } = payload;

    pool.query(`UPDATE transactions SET complete=TRUE where token='${token}'`, (error, _) => {
        if (error) {
            throw error;
        };

        res.status(200).send('Transaction completed saved to db')
    });
});

app.post('/download_guide', (req, res) => {
    const payload = req.body;
    const { token } = payload;

    pool.query(`Select products.s3_file_name from transactions JOIN products ON products.id=transactions.product_id WHERE transactions.token='${token}'`, (error, results) => {
        if (error) {
            throw error;
        };

        const transaction = results.rows;

        if (transaction.length > 0){
            const filename = isProduction? transaction[0].s3_file_name: 'test-file.png';
            retrieveFile(filename, res)
        } else {
            res.status(400).send('No record of transaction');
        };
    });
});

const retrieveFile = (filename, res) => {
    const getParams = {
        Bucket: process.env.BUCKET,
        Key: filename,
        Expires: 360, // seconds
    };

    const url = s3.getSignedUrl('getObject', getParams);
    
    res.json({downloadUrl: url, filename: filename});
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Runing on port ${port}`);
});