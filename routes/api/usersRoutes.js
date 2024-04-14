const express = require('express');
const usersController = require('../../controllers/usersController');
const auth = require('../../middleware/auth'); // 
const upload = require('../../config/multerConfig');

const router = express.Router();

router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

router.get('/logout', auth, usersController.logout);

router.get('/current', auth, usersController.getCurrentUser);

router.patch('/', auth, usersController.updateSubscription);

router.patch('/avatars', auth, upload.single('avatar'), usersController.updateAvatar);



module.exports = router;

