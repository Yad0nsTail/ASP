const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'users.db'); // Database file
const schemaPath = path.resolve(__dirname, 'schema.sql'); // SQL schema file

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(' Database connection failed:', err.message);
  } else {
    console.log(` Connected to SQLite database at ${dbPath}`);
    
    //  Load schema.sql when the database starts
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema, (err) => {
        if (err) {
          console.error(' Failed to load schema.sql:', err.message);
        } else {
          console.log(' Database schema loaded successfully.');
        }
      });
    } else {
      console.log(' schema.sql not found, skipping schema setup.');
    }
  }
});

module.exports = db;
