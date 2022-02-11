const jwt = require("jsonwebtoken");
const jwtUtils = require('./jwtUtils');
const { User } = require("../models/User");

const userFromToken = async (request) => {
    const token = jwtUtils.extractor(request);
    if (!token) {
        return null;
    }
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
        return null;
    }

    const username = decoded?.payload?.username;
    if (username) {
        return User.findOne({ username: username });
    }
    return null;
}

module.exports = { userFromToken };
