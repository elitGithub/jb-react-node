const mongoose = require('mongoose');
const logger = require('../middleware/logEvents');
const vacationSchema = require('../db/VacationSchema');
const jwtUtils = require("../middleware/jwtUtils");
const userUtils = require("../middleware/userUtils");
const jwt = require("jsonwebtoken");

const Vacation = mongoose.model('Vacation', vacationSchema);

const list = async (req, res) => {
    try {
        const vacations = await Vacation.find({});
        res.json({ success: true, message: '', data: vacations });
    } catch (e) {
        await logger.logErrors(e);
        return res.json({ success: false, message: e, data: {} });
    }

};
const create = async (req, res) => {
    await Vacation.create(req.body, (err, doc) => {
        if (err) {
            logger.logErrors(err);
            return res.json({ success: false, message: err, data: {} });
        }
        return res.json({ success: true, message: '', data: doc });
    });
};


const readOne = async (req, res) => {
    const vacation = await Vacation.findOne({ _id: req.params.id });
    res.json({ success: true, message: '', data: vacation });
}

const follow = async (req, res) => {
    const vacation = await Vacation.findOne({ _id: req.params.id });
    if (!vacation) {
        return res.json({ success: false, message: 'No such entity.', data: {} });
    }

    const user = await userUtils.userFromToken(req);
    if (user) {
        const index = user.followedVacations.indexOf(req.params.id);
        if (index > -1) {
            return res.json({ success: true, message: 'Vacation is already followed', data: {} });
        }
        user.followedVacations.push(req.params.id);
        user.save();
    }

    return res.json({ success: true, message: '', data: {} });
};

const update = async (req, res) => {
    if (!req.params.id) {
        return res.json({ success: false, message: 'Missing required parameter id.', data: {} });
    }

    const vacation = await Vacation.findOne({ _id: req.params.id });
    if (vacation) {
        return res.json({ success: true, message: '', data: {} });
    }
};

module.exports = { Vacation, create, update, list, readOne, follow };
