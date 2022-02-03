const User = require('../models/User');
const logEvents = require('../middleware/logEvents');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const auth_hdr = require("passport-jwt/lib/auth_header");
const AUTH_HEADER = "authorization";
const LEGACY_AUTH_SCHEME = "JWT";
const BEARER_AUTH_SCHEME = 'bearer:';

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

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const register = async (req, res) => {
    const { userName, password } = req.body;
    if (!password || !userName) {
        res.status(400).json({
            success: false,
            message: 'Username and password are required.',
            data: []
        });

        res.end();
        return;
    }
    try {
        return await User.register({ username: userName }, password, (err, user) => {
            if (err) {
                return res.status(409).json({
                    success: false,
                    message: err.toString(),
                    data: []
                });
            }

            if (user) {
                return passport.authenticate('local', (err, info) => {
                    if (err) {
                        res.json({ success: false, message: err })
                    } else if (!user) {
                        res.json({ success: false, message: 'username or password incorrect' });
                    } else {
                        req.login(user, (err) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                const token = jwt.sign({
                                        userId: user._id,
                                        username: user.username
                                    }, process.env.SECRET,
                                    { expiresIn: '24h' })
                                res.json({ success: true, message: "Authentication successful", data: { token } });
                            }
                        })
                    }
                })(req, res);
            }
        });
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.',
            data: []
        });
    }
};

const login = async (req, res) => {
    if (req.headers.authorization && req.headers.authorization.length) {
        let valid = false;
        const token = extractor(req);
        if (token) {
            const decodedToken = jwt.decode(token, {
                complete: true
            });

            if (!decodedToken) {
                res.json({ success: false, message: "", data: [] });
            }

            if (decodedToken) {
                console.log(decodedToken.payload);
                console.log(Date.now());
                // const token = jwt.sign({
                //         userId: user._id,
                //         username: user.username
                //     }, process.env.SECRET,
                //     { expiresIn: '24h' })
                res.json({ success: true, message: "Authentication successful", data: { decodedToken } });
                return;
            }

        }
        res.json({ success: false, message: "", data: [] });
    }
};

const findUserByEmail = async (searchParams) => {
    try {
        return await User.find({ userName: searchParams.userName });
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return false;
    }
};

const listUsers = async () => {
    try {
        const users = await User.find({});
        console.log(users);
        const userMap = {};
        users.forEach((user) => {
            console.log(user);
            userMap[user._id] = user;
        });
        return await User.find({});
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return false;
    }
};

module.exports = { register, findUserByEmail, listUsers, login };
