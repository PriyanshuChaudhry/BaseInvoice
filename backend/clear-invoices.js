const mongoose = require('mongoose');
require('dotenv').config();

console.log('🗑️  Clearing all invoices from database...\n');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const result = await mongoose.connection.db.collection('invoices').deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} invoice(s)`);
    console.log('');
    console.log('Database is now clean! You can start fresh. 🎉');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
