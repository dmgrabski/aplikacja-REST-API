const express = require('express');
const contactsService = require('../../services/contactsServices');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  if (!name || !email || !phone) { 
    return res.status(400).json({ message: "Missing required name, email, or phone field" });
  }

  try {
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const deletedContact = await contactsService.removeContact(req.params.contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not founds' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const updatedContact = await contactsService.updateContact(req.params.contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  
  if (req.body.favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await contactsService.updateStatusContact(req.params.contactId, { favorite: req.body.favorite });
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});


module.exports = router;

//dodadkowa zmiana! 
//zmiany


