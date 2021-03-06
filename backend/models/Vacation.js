const mongoose = require('mongoose');
const logger = require('../middleware/logEvents');
const vacationSchema = require('../db/VacationSchema');
const userUtils = require("../utils/userUtils");

const Vacation = mongoose.model('Vacation', vacationSchema);

const list = async (req, res) => {
    try {
        return await Vacation.find({}).lean();
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
    try {
        return await Vacation.findOne({ _id: req.params.id }).lean();
    } catch (e) {
        await logger.logErrors(e);
        return res.json({ success: false, message: e, data: {} });
    }
}

const deleteVacation = async (req, res) => {
    const vacation = await Vacation.findByIdAndDelete({ _id: req.params.id });
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

const unfollow = async (req, res) => {
    const vacation = await Vacation.findOne({ _id: req.params.id });
    if (!vacation) {
        return res.json({ success: false, message: 'No such entity.', data: {} });
    }

    const user = await userUtils.userFromToken(req);
    if (user) {
        const index = user.followedVacations.indexOf(req.params.id);
        if (index < 0) {
            return res.json({ success: true, message: 'This vacation is not followed', data: {} });
        }
        user.followedVacations.splice(index, 1);
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
        vacation.name = req.body.name || vacation.name;
        vacation.description = req.body.description || vacation.description;
        vacation.image = req.body.image || vacation.image;
        vacation.dateStart = req.body.dateStart || vacation.dateStart;
        vacation.dateEnd = req.body.dateEnd || vacation.dateEnd;

        try {
            await vacation.save();
            return res.json({ success: true, message: '', data: { vacation } });
        } catch (e) {
            await logger.logErrors(e);
            return res.json({ success: false, message: 'An error occurred', data: {} });
        }

    }
};

module.exports = { Vacation, create, update, list, readOne, follow, unfollow, deleteVacation };
