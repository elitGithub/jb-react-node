const mongoose = require('mongoose');

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

module.exports = vacationSchema;