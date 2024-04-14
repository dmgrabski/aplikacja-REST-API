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

exports.updateAvatar = async (req, res) => {
  const file = req.file;
  const tempPath = file.path;
  const targetPath = path.join(__dirname, '../public/avatars', file.filename);

  try {
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(targetPath);
    await fs.unlink(tempPath); 

    await User.findByIdAndUpdate(req.user._id, { avatarURL: `/avatars/${file.filename}` });

    res.status(200).json({ avatarURL: `/avatars/${file.filename}` });
  } catch (error) {
    await fs.unlink(tempPath);
    res.status(500).send({ message: "Error processing the avatar." });
  }
};
