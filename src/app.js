const express = require("express");
const app = express();

const db = require("./queries");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ welcome: "welcome" });
});

app.get("/posts/", db.getPosts);

app.get("/posts/:id", db.getPostsById);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
