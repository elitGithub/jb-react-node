const express = require('express');
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route('/login(.html)?')
    .get((req, res) => usersController.refresh(req, res))
    .post((req, res) => usersController.login(req, res));

router.route('/register(.html)?')
    .post((req, res) => usersController.register(req, res));

module.exports = router;
