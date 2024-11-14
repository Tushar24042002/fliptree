const http = require('http');
const express = require('express');
const pool = require('./config/config');
const bodyParser = require("body-parser");
const userRoutes = require("./routers/userRoutes");
const cartRoutes = require("./routers/cartRoutes");
const productRoutes = require("./routers/productRoutes");
const env = require('dotenv');
env.config();
const cors = require('cors');
const { decryptRequestData } = require('./utils/cryptoAuth');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(decryptRequestData);

app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);


app.get('/', (req, res) => {
    pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
        if (error) {
            console.error('Error connecting to MySQL:', error);
            return res.status(500).send('Database connection error');
        }
        res.send(`The solution is: ${results[0].solution}`);
    });
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
});