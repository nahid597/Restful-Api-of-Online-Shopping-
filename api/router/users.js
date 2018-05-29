const express = require('express');
const router = express.Router();

const checkauth = require('../middleware/check-auth');



const usercontrol = require('../controller/users');

router.post('/signup', usercontrol.user_signup);

router.post('/login', usercontrol.user_login);


router.delete('/:userId', checkauth, usercontrol.user_delete);


module.exports = router;