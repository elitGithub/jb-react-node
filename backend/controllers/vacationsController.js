const Vacation = require('../models/Vacation');
const jwtUtils = require("../middleware/jwtUtils");


const list = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        return await Vacation.list(req, res);
    } else {
        return res.sendStatus(403);
    }
}

const readVacation = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        return await Vacation.readOne(req, res);
    } else {
        return res.sendStatus(403);
    }

};

const createVacation = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        return await Vacation.create(req, res);
    } else {
        return res.sendStatus(403);
    }

};

const updateVacation = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        return await Vacation.update(req, res);
    } else {
        return res.sendStatus(403);
    }

};

module.exports = { list, createVacation, readVacation, updateVacation };