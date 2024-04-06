const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');
const authMiddleware = require('../middleware/auth'); 

router.post('/', authMiddleware, contactsController.createContact);


router.get('/', authMiddleware, contactsController.getUserContacts);

module.exports = router;