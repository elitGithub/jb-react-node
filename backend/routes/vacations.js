const express = require('express');
const router = express.Router();
const vacationsController = require('../controllers/vacationsController');

router.route('/vacation-list(.html)?')
    .get((req, res) => vacationsController.list(req, res))
    .post();

router.route('/vacation(.html)?/:id?')
    .get((req, res) => vacationsController.readVacation(req, res))
    .post((req, res) => vacationsController.createVacation(req, res));

module.exports = router;
