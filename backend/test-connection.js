const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
console.log('');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    console.log('');
    console.log('Your MongoDB is working correctly! 🎉');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ FAILED! Connection Error!');
    console.log('');
    console.log('Error Message:', err.message);
    console.log('');
    console.log('Common Issues:');
    console.log('1. Check if IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Make sure database name is in the connection string');
    console.log('');
    process.exit(1);
  });
