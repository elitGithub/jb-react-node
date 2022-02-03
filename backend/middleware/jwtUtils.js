const auth_hdr = require("passport-jwt/lib/auth_header");

const AUTH_HEADER = "authorization";
const LEGACY_AUTH_SCHEME = "JWT";
const BEARER_AUTH_SCHEME = 'bearer';

const extractor = (request) =>  {
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

module.exports = extractor;