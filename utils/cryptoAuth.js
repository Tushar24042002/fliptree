const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const env = require('dotenv');
env.config();
const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.APP_SECRET).toString();
    return ciphertext;
};


const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.APP_SECRET);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        throw new Error('Failed to decrypt token');
    }
};


const decryptBodyData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.APP_SECRET);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedData) {
            throw new Error('Decryption failed');
        }
        return JSON.parse(decryptedData);
    } catch (error) {
        throw new Error('Decryption failed' + error);
    }
};


const decryptRequestData = (req, res, next) => {
    try {
        if (['POST', 'PUT'].includes(req.method)) {
            if (req.body && Object.keys(req.body).length > 0) {
                if (req.body.data) {
                    const decryptedData = decryptBodyData(req.body.data);
                    req.body = { ...decryptedData, ...req.body };
                    delete req.body.data;
                }
            }
        }
        next();
    } catch (error) {
        res.status(400).json({ error: `Invalid encrypted data` });
    }
};




module.exports = {
    encryptData,
    decryptData,
    decryptRequestData
}