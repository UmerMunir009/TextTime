

const { makeSignature } = require('../utils/baishunGame');

module.exports.verifySignatureTemp = (req, res, next) => {

    const { signature_nonce, timestamp, signature } = req.body;

    if (!signature_nonce || !timestamp || !signature) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (Math.abs(currentTime - timestamp) > 15) {
        return res.status(400).json({ message: 'Request timed out' });
    }

    const expectedSignature = makeSignature(signature_nonce, timestamp)

    // Compare with provided signature
    if (expectedSignature !== signature) {

        console.log('Sign mismatch. Expected:', expectedSignature, 'Received:', signature);

        return res.status(200).json({
            code: 1003,
            message: 'sign error',
            data: {}
        });
    }

    next();
}


module.exports.verifySignature = (req, res, next) => {

    const { signature, signature_nonce, timestamp } = req.body;

    // Check that timestamp is within the valid 15-second window

    const requestTime = parseInt(timestamp, 10);

    const SIGNATURE_VALIDITY_PERIOD = 1000 * 60 * 60 * 24;

    if (Date.now() - requestTime > SIGNATURE_VALIDITY_PERIOD) {

        return res.status(401).json({ error: 'Request timed out' });
    }

    // Recompute the signature with received values
    const expectedSignature = makeSignature(signature_nonce, timestamp);

    if (expectedSignature !== signature) {

        console.log('Sign mismatch. Expected:', expectedSignature, 'Received:', signature);

        return res.status(200).json({
            code: 1003,
            message: 'Signature Error',
        });
    }

    next();
};
