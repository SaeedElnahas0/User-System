var express = require('express');
var router = express.Router();
const controll = require('../controller/user_controll');

//signup
router.post('/signup', controll.signupUser);

//signin
router.post('/signin', controll.signinUser);

//update
router.patch('/update/:id', controll.updateUser);
 
//delete
router.delete('/delete/:id', controll.deleteUser);

module.exports = router;
