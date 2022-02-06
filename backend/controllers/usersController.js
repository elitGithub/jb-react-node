const logEvents = require('../middleware/logEvents');
const User = require("../models/User");
const jwtUtils = require("../middleware/jwtUtils");

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
        return await User.create(req, res);
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return res.status(500).json({
            success: false,
            message: e.toString(),
            data: []
        });
    }
};

const login = async (req, res) => {
    return await User.userAuth(req, res);
}

const refresh = async (req, res) => {
    const user = await jwtUtils.userFromToken(req);
    if (user) {
        const token = jwtUtils.sign(user);
        return res.json({
            success: true,
            message: "Refresh Successful",
            data: { token, userName: user.userName, firstName: user.firstName, lastName: user.lastName }
        });
    }

    res.json({ success: false, message: "", data: [] });
};

module.exports = { register, login, refresh };
