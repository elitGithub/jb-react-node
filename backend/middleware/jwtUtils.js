const auth_hdr = require("passport-jwt/lib/auth_header");
const jwt = require("jsonwebtoken");

const AUTH_HEADER = "authorization";
const LEGACY_AUTH_SCHEME = "JWT";
const BEARER_AUTH_SCHEME = 'bearer';

const extractor = (request) => {
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
        { expiresIn: '24h' });
    if (token) {
        return token;
    }

    return null;
}

module.exports = { extractor, sign };