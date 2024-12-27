const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/pos_db_new2';

console.log('Attempting to connect to MongoDB with URL:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('MongoDB connection opened successfully');
});

module.exports = db;