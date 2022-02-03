const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
    // role: mongoose.SchemaTypes.ObjectId <- references another object based on id. Will be implemented with the Role model.
});

userSchema.plugin((passportLocalMongoose));

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const create = async (req, res) => {
    const { userName, password, firstName, lastName } = req.body;
    // the first object contains all the stuff we want to create the user with (list first name and so on). Passwords are hashed and handled separately.
    return await User.register({ username: userName, firstName, lastName }, password, (err, user) => {
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
                                    username: user.username,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }, process.env.SECRET,
                                { expiresIn: '24h' });
                            res.json({ success: true, message: "Authentication successful", data: { token, userName, firstName, lastName } });
                        }
                    })
                }
            })(req, res);
        }
    });
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
        return passport.authenticate('local', (err, info) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                req.login(user, (err) => {
                    if (err) {
                        res.json({ success: false, message: err })
                    } else {
                        const token = jwt.sign({
                                userId: user._id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName
                            }, process.env.SECRET,
                            { expiresIn: '24h' });
                        res.json({
                            success: true,
                            message: "Authentication successful",
                            data: { token, userName: user.username, firstName: user.firstName, lastName: user.lastName }
                        });
                    }
                })
            }
        })(req, res);
    });
}


module.exports = { User };
module.exports = { create };
module.exports = { userAuth };
