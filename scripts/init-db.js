const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Create connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
});

// Read SQL file
const sqlFile = fs.readFileSync(path.join(__dirname, '../database/init.sql'), 'utf8');

// Execute SQL commands
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');
  
  connection.query(sqlFile, (err, results) => {
    if (err) throw err;
    console.log('Database initialized successfully');
    connection.end();
  });
});