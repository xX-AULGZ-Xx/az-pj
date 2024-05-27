const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const ejs = require('ejs');
const path = require('path');

// Set the views directory for EJS templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create a connection pool for improved performance and scalability
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test',
  // Consider adding connection pool options like connectionLimit to manage connections
});

// Error handling for connection pool creation
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Exit on critical error
  } else {
    console.log('Database connection established');
    // Release the connection back to the pool after usage
    connection.release();
  }
});

// Route handler with asynchronous query using async/await
app.get('/', async (request, response) => {
  try {
    const [results] = await pool.query('SELECT * FROM person');
    response.render('layout', {  // Assuming your main view is named index.ejs
      resultsPerson: results,
    });
  } catch (error) {
    console.error('Error querying database:', error);
    response.status(500).send('Internal Server Error'); // Handle errors gracefully
  }
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
