const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB () {
    await mongoose.connect(process.env.MONGODB).then(() => {
        console.log('MongoDB connected successfully');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
}
module.exports = { connectDB };                                  