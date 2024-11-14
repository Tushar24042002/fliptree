const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const secret = "YOUR_RAZORPAY_WEBHOOK_SECRET";
    const signature = req.headers['x-razorpay-signature'];
    
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;

    if (event === 'payout.created') {
        const payoutId = req.body.payload.payout.entity.id;
    }

    res.status(200).send('Webhook received');
});
