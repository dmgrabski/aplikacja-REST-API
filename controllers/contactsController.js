const Contact = require('../models/contact');

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
      owner: req.user._id
    });

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
