const mongoose = require('mongoose');
const logger = require('../middleware/logEvents');

const vacationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        validator: v => /[A-Za-z]/.test(v)
    },
    description: {
        type: String,
        required: true,
        minLength: 3,
        validator: v => /[A-Za-z]/.test(v)
    },
    image: {
        type: String,
        required: true,
    },
    dateStart: {
        type: Date,
        default: () => Date.now(),
    },
    dateEnd: {
        type: Date,
        default: () => Date.now(),
    },
    price: {},
    followers: {},
});


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
    if (!req.params.id) {
        return res.json({ success: false, message: 'Missing required parameter id.', data: {} });
    }
    const vacation = await Vacation.findOne({ _id: req.params.id });
    res.json({ success: true, message: '', data: vacation });
}

const update = async (req, res) => {
    if (!req.params.id) {
        return res.json({ success: false, message: 'Missing required parameter id.', data: {} });
    }

    const vacation = await Vacation.findOne({ _id: req.params.id });
    if (vacation) {

    }
};

module.exports = { Vacation, create, update, list, readOne };