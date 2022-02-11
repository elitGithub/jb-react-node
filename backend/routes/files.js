const express = require('express');
const filesController = require("../controllers/filesController");
const router = express.Router();

router.route('/')
    .get((req, res) => {})
    .post(async (req, res) =>  await filesController.upload(req, res));

module.exports = router;
