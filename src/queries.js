const { Pool } = require("pg");
const utils = require("./utils"); // Ensure this is being used if needed

const DATABASE = process.env.PG_DATABASE;
const USERNAME = process.env.PG_USER;
const PASSWORD = process.env.PG_PASSWORD;
const HOST = process.env.PG_HOST;
const PORT = process.env.PG_PORT;

// Set up the pool configuration
const poolConfig = {
  user: USERNAME,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
  max: 5, // Max number of clients in the pool
  min: 2, // Min number of clients in the pool
  idleTimeoutMillis: 600000, // Connection idle timeout
};

// Create a new pool instance with the configuration
const pool = new Pool(poolConfig);

// Function to get all users
const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      response.status(500).send("An error occurred while fetching users");
      return;
    }
    response.status(200).json(results.rows);
  });
};

// Function to get a user by ID
const getUserById = async (request, response, next) => {
  const id = parseInt(request.params.id, 10);

  try {
    if (id <= 0) {
      return next(new Error("Invalid ID"));
    }

    // Query to get the maximum ID
    const maxIdResult = await pool.query("SELECT MAX(id) AS max_id FROM users");
    const maxId = maxIdResult.rows[0].max_id;

    if (id > maxId) {
      return next(new Error("ID exceeds the maximum allowed"));
    }

    // Query to get the user by ID
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (userResult.rows.length === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    response.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error("Error fetching user by ID", error.stack); // Better error logging
    next(error);
  }
};

module.exports = { getUsers, getUserById };
