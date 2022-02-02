const express = require('express');
const router = express.Router();
const path = require('path');
const usersController = require("../controllers/usersController");

router.route('/login(.html)?')
    .post((req, res) => usersController.login());

router.route('/register(.html)?')
    .get()
    .post((req, res) =>  usersController.register(req, res));

router.post('/find-user(.html)?', async (req, res) => {
    const result = await usersController.findUserByEmail(req.body);
    res.json({ 'success': !!result, 'message': '', data: result });
    res.end();
});
router.get('/users-list(.html)?', async (req, res) => {
    const result = await usersController.listUsers();
    console.log(result);
    res.json({ 'success': !!result, 'message': '', data: result });
    res.end();
});



module.exports = router;
