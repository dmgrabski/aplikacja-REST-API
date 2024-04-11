require('dotenv').config();
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db');
const contactsRoutes = require('./routes/contactsRoutes');

connectDB();

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/usersRoutes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.use('/api/contacts', contactsRoutes)

app.use('/avatars', express.static('public/avatars'));


module.exports = app;

