const auth_hdr = require("passport-jwt/lib/auth_header");
const jwt = require("jsonwebtoken");
const logEvents = require("./logEvents");
const mongoose = require("mongoose");
const userSchema = require("../db/UserSchema");

const User = mongoose.model('User', userSchema);

const AUTH_HEADER = "authorization";
const LEGACY_AUTH_SCHEME = "JWT";
const BEARER_AUTH_SCHEME = 'bearer';

const userFromToken = async (request) => {
    const token = extractToken(request);
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

const extractToken = (request) => {
    const auth_scheme_lower = BEARER_AUTH_SCHEME.toLowerCase();
    let token = null;
    if (request.headers[AUTH_HEADER]) {
        const auth_params = auth_hdr.parse(request.headers[AUTH_HEADER]);
        if (auth_params && auth_scheme_lower === auth_params.scheme.toLowerCase()) {
            token = auth_params.value;
        }
    }
    return token;
};

const sign = (user) => {
    const token = jwt.sign({
            userId: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            userRole: user.role
        }, process.env.SECRET,
        { expiresIn: '12h' });
    if (token) {
        return token;
    }

    return null;
}

const validate = async (authHeader) => {
    if (!authHeader?.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.split(' ')[1];
    return await jwt.verify(
        token,
        process.env.SECRET,
        (err, decoded) => {
            if (err) {
                logEvents.customEmitter.emit('error', err);
                return true;
            }

            return decoded;
        }
    );
}

module.exports = { extractor: extractToken, sign, validate, userFromToken };
