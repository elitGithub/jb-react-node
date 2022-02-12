const Vacation = require('../models/Vacation');
const jwtUtils = require("../utils/jwtUtils");
const fileUtils = require("../utils/fileUtils");

const list = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        let vacations = await Vacation.list(req, res);
        vacations = Promise.all(await vacations.map(async vacation => {
            vacation.imageUrl = await fileUtils.createPublicUrl(vacation.image);
            return vacation;
        }));

        return res.json({ success: true, message: '', data: await vacations });
    } else {
        return res.sendStatus(403);
    }
}

const follow = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        if (!req.params.id) {
            return res.json({ success: false, message: 'Missing required parameter id.', data: {} });
        }
        return await Vacation.follow(req, res);
    } else {
        return res.sendStatus(403);
    }
}

const readVacation = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        if (!req.params.id) {
            return res.json({ success: false, message: 'Missing required parameter id.', data: {} });
        }
        const vacation = await Vacation.readOne(req, res);
        vacation.imageUrl = await fileUtils.createPublicUrl(vacation.image);
        return res.json({ success: true, message: '', data: await vacation });
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

const deleteVacation = async (req, res) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const authorized = await jwtUtils.validate(authHeader);
    if (authorized) {
        return await Vacation.deleteVacation(req, res);
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

module.exports = { list, createVacation, readVacation, updateVacation, follow, deleteVacation };
