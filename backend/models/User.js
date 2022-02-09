const mongoose = require('mongoose');
const passport = require("passport");
const ROLES = require("../shared/roles");
const jwtUtils = require("../middleware/jwtUtils");
const userSchema = require('../db/UserSchema');

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const create = async (req, res) => {
    const { userName, password, firstName, lastName } = req.body;
    // the first object contains all the stuff we want to create the user with (first name and so on). Passwords are hashed and handled separately.
    return await User.register({
        username: userName,
        firstName,
        lastName,
        role: ROLES.Customer
    }, password, (err, user) => {
        if (err) {
            return res.status(409).json({
                success: false,
                message: err.toString(),
                data: []
            });
        }

        if (user) {
            return passport.authenticate('local', (err) => {
                if (err) {
                    return res.json({ success: false, message: err })
                } else if (!user) {
                    return res.json({ success: false, message: 'Username or Password incorrect' });
                } else {
                    return req.login(user, (err) => {
                        if (err) {
                            res.json({ success: false, message: err })
                        } else {
                            const token = jwtUtils.sign(user);
                            res.json({
                                success: true,
                                message: "Authentication successful",
                                data: { token, userName, firstName, lastName, role: user.role }
                            });
                        }
                    })
                }
            })(req, res);
        }
    });
}

const userAuth = async (req, res) => {
    const authenticate = await User.authenticate();
    authenticate(req.body.userName, req.body.password, (err, result) => {
        if (err) {
            return res.status(401).json({ success: false, message: err })
        }

        if (!result) {
            return res.status(401).json({ success: false, message: 'Bad credentials' })
        }

        const token = jwtUtils.sign({
            _id: result._id,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
            userRole: result.role.join(',')
        });
        return res.json({
            success: true,
            message: "Authentication successful",
            data: {
                token,
                userName: result.username,
                firstName: result.firstName,
                lastName: result.lastName,
                role: result.role.join(',')
            }
        });
    });
}


module.exports = { User, create, userAuth };
