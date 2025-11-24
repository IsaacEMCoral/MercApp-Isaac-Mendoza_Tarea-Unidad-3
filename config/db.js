const mongoose = require('mongoose');

async function connectDB(uri) {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB conectado');
}

module.exports = connectDB;
