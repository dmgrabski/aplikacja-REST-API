const express = require('express');
const usersController = require('../../controllers/usersController');
const auth = require('../../middleware/auth');
const upload = require('../../config/multerConfig');
const User = require('../../models/user');

const router = express.Router();

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.get('/logout', auth, usersController.logout);
router.get('/current', auth, usersController.getCurrentUser);
router.patch('/', auth, usersController.updateSubscription);
router.patch('/avatars', auth, upload.single('avatar'), usersController.updateAvatar);
router.post('/verify', usersController.resendVerificationEmail);


router.get('/verify/:verificationToken', async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationToken = null;
    user.verify = true;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


