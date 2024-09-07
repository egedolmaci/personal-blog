const Pool = require("pg").Pool;
const utils = require("./utils");

const DATABASE = process.env.PG_DATABASE;
const USERNAME = process.env.PG_USER;
const PASSWORD = process.env.PG_PASSWORD;
const HOST = process.env.PG_HOST;
const PORT = process.env.PG_PORT;

const pool = new Pool({
  connectionString: process.env.connectionStr,
});

//const pool = new Pool({
//user: "blog_admin",
//host: "localhost",
//database: "blog_api",
//password: "blog_admin",
//port: 5432,
//});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack); // Better error logging
      response.status(500).send("An error occurred while fetching users");
      return;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = async (request, response, next) => {
  const id = parseInt(request.params.id, 10); // Ensure the ID is an integer

  try {
    if (id <= 0) {
      return next(new Error("Invalid ID")); // Validate the ID before querying the database
    }

    // Query to get the maximum ID
    const maxIdResult = await pool.query("SELECT MAX(id) AS max_id FROM users");
    const maxId = maxIdResult.rows[0].max_id;

    if (id > maxId) {
      return next(new Error("Id Exceeds")); // Validate the ID before querying the database
    }

    // Query to get the user by ID
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (userResult.rows.length === 0) {
      return response.status(404).json({ error: "User not found" }); // Handle user not found
    }

    response.status(200).json(userResult.rows[0]); // Send user data
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

module.exports = { getUsers, getUserById };
