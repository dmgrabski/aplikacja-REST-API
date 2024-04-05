const express = require('express');
const Joi = require('joi');
const contactsService = require('../../services/contactsServices');
const auth = require('../../middleware/auth');

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).required(),
  favorite: Joi.boolean()
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
});

router.get('/', auth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    
    const filterOptions = {};
    if (favorite !== undefined) {
      filterOptions.favorite = favorite === 'true';
    }

    const contacts = await contactsService.listContacts({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      filterOptions,
    });
    
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', auth, async (req, res, next) => {
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

router.post('/', auth, async (req, res, next) => {
  const validationResult = contactSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  try {
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', auth, async (req, res, next) => {
  try {
    const deletedContact = await contactsService.removeContact(req.params.contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', auth, async (req, res, next) => {
  const validationResult = contactSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

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

router.patch('/:contactId/favorite', auth, async (req, res, next) => {
  const validationResult = favoriteSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
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
