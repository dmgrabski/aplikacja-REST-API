const Contact = require('../models/contacts');

async function listContacts() {
  return Contact.find();
}

async function getContactById(contactId) {
  return Contact.findById(contactId);
}

async function addContact(body) {
  return Contact.create(body);
}

async function removeContact(contactId) {
  return Contact.findByIdAndRemove(contactId);
}

async function updateContact(contactId, body) {
  return Contact.findByIdAndUpdate(contactId, body, { new: true });
}

async function updateStatusContact(contactId, body) {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, { $set: body }, { new: true });
  return updatedContact;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
