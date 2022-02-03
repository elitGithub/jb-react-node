const User = require('../models/User');
const logEvents = require('../middleware/logEvents');
const jwt = require("jsonwebtoken");

const { create, userAuth } = require("../models/User");
const extractor = require("../middleware/jwtUtils");

const register = async (req, res) => {
    if (!req.body.password || !req.body.userName) {
        res.status(400).json({
            success: false,
            message: 'Username and password are required.',
            data: []
        });

        res.end();
        return;
    }
    try {
        return await create(req, res)
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return res.status(500).json({
            success: false,
            message: e.toString(),
            data: []
        });
    }
};

const login = (req, res) => {
    return userAuth(req, res);
}

const refresh = async (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, message: '', data: {} });
        return;
    }

    let token = extractor(req);

    let decoded = jwt.decode(token, { complete: true });

    if (decoded && decoded.payload) {
        const user = decoded.payload;
        const token = jwt.sign({
                userId: user.userId,
                username: user.userName,
                firstName: user.firstName,
                lastName: user.lastName
            }, process.env.SECRET,
            { expiresIn: '24h' });
        return res.json({ success: true, message: "Refresh Successful", data: { token, userName: user.userName, firstName: user.firstName, lastName: user.lastName } });
    }

    res.json({ success: false, message: "", data: [] });
};

module.exports = { register, login, refresh };
