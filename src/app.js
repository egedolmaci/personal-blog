const express = require("express");
const app = express();

const db = require("./queries");

const PORT = 4000;

app.get("/", (req, res) => {
  res.json({ welcome: "welcome" });
});

app.get("/users/", (req, res, next) => {
  try {
    throw new Error("Something went wrong while fething users");
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", db.getUserById);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
