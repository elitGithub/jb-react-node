const logEvents = require('../middleware/logEvents');
const jwt = require("jsonwebtoken");
const Vacation = require('../models/Vacation');

const list = (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.SECRET,
        (err, decoded) => {
            if (err) {
                logEvents.customEmitter.emit('error', err);
                return res.sendStatus(403);
            }
            Vacation.list(req, res);
        }
    );
}

const readVacation = (req, res) => {
    return Vacation.readOne(req, res);
};

const createVacation = (req, res) => {
    return Vacation.create(req, res);
};

module.exports = { list, createVacation, readVacation };