const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require("passport");
const ROLES = require("../shared/roles");
const jwtUtils = require("../middleware/jwtUtils");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        immutable: true,
        minLength: 3,
        validator: v => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v),
        message: props => `${ props.value } is not a valid email`
    },
    password: {
        type: String,
        minLength: 8
    },
    firstName: String,
    lastName: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    followedVacations: [String],
    role: [String],
});

userSchema.plugin((passportLocalMongoose));

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const create = async (req, res) => {
    const { userName, password, firstName, lastName } = req.body;
    // the first object contains all the stuff we want to create the user with (list first name and so on). Passwords are hashed and handled separately.
    return await User.register({ username: userName, firstName, lastName, role: ROLES.Customer }, password, (err, user) => {
        if (err) {
            return res.status(409).json({
                success: false,
                message: err.toString(),
                data: []
            });
        }

        if (user) {
            return passport.authenticate('local', {}, (err) => {
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


const userInfo = async (user) => {
    const userinfo = await User.findOne({ username: user.username });
    if (userinfo) {
        return userinfo;
    }

    return null;
}
const userAuth = (req, res) => {
    const user = new User({
        username: req.body.userName,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            return res.status(409).json({
                success: false,
                message: err.toString(),
                data: []
            });
        }
        return passport.authenticate('local', {}, (err) => {
            if (err) {
                return res.json({ success: false, message: err })
            } else {
                return req.login(user, async (err) => {
                    if (err) {
                        return res.json({ success: false, message: err })
                    } else {
                        const registeredUser = await userInfo(user);
                        const token = jwtUtils.sign(registeredUser);
                        return res.json({
                            success: true,
                            message: "Authentication successful",
                            data: {
                                token,
                                userName: registeredUser.username,
                                firstName: registeredUser.firstName,
                                lastName: registeredUser.lastName,
                                role: registeredUser.role
                            }
                        });
                    }
                });
            }
        })(req, res);
    });
}


module.exports = { User, create, userAuth };
