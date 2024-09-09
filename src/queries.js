const Pool = require("pg").Pool;
const utils = require("./utils");

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

const getPosts = (request, response) => {
  pool.query("SELECT * FROM posts", (error, results) => {
    response.status(200).json(results.rows);
  });
};

const getPostsById = async (request, response, next) => {
  const id = parseInt(request.params.id, 10); // Ensure the ID is an integer

  try {
    if (id <= 0) {
      return next(new Error("Invalid ID")); // Validate the ID before querying the database
    }

    // Query to get the maximum ID
    const maxIdResult = await pool.query("SELECT MAX(id) AS max_id FROM posts");
    const maxId = maxIdResult.rows[0].max_id;

    if (id > maxId) {
      return next(new Error("Id Exceeds")); // Validate the ID before querying the database
    }

    // Query to get the user by ID
    const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [
      id,
    ]);

    if (postResult.rows.length === 0) {
      return response.status(404).json({ error: "Post not found" }); // Handle user not found
    }

    response.status(200).json(postResult.rows[0]); // Send user data
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const createUser = (req, res, next) => {
  const { title, content, author } = req.body;

  try {
    pool.query(
      "insert into posts (title, content, author) values($1, $2, $3)",
      [title, content, author],
      (error, results) => {
        if (error) {
          throw error;
        }

        response.status(201).send("User added with ID: ${results.insertID}");
      },
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getPostsById, createUser };
