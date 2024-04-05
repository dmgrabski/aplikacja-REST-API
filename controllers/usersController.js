const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Joi = require('joi');

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.signup = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: "starter"
    });

    await newUser.save();
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  
  exports.login = async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      user.token = token;
      await user.save();
  
      res.json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.logout = async (req, res) => {
    try {
      const user = req.user;
      user.token = null;
      await user.save();
  
      res.status(204).send();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  };        
 
  exports.getCurrentUser = async (req, res) => {
    try {
      
      const { email, subscription } = req.user;
      res.json({
        email,
        subscription
      });
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  };
  
  exports.updateSubscription = async (req, res) => {
    try {
      const userId = req.user._id; 
      const { subscription } = req.body;
      if (!['starter', 'pro', 'business'].includes(subscription)) {
        return res.status(400).json({ message: "Invalid subscription value" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: { subscription } }, { new: true });
      res.json({ email: updatedUser.email, subscription: updatedUser.subscription });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

