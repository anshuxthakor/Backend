const mongoose = require('mongoose');

async function connectToDatabase(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB successfully');
};

module.exports = connectToDatabase;