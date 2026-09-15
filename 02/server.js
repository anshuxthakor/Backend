const express = require("express");
const app = express();

app.use(express.json());

const PORT = 8888;

let users = [];

app.get("/", (req, res) => {
  res.send("Hello, From Express!");
});

// CREATE — Create a new user
app.post("/create", (req, res) => {
  let body = req.body;
  users.push(body);
  res.send("User created successfully");
});

// READ — Get all users
app.get("/users", (req, res) => {
  res.send(users);
});

// UPDATE — Update a user by ID
app.put("/update/:id", (req, res) => {
  let { id } = req.params;
  let body = req.body;
  users = users.map((user) => (user.id === Number(id) ? { ...user, ...body } : user));
  res.send("User updated successfully");
});

// DELETE — Delete a user by ID
app.delete("/delete/:id", (req, res) => {
  let { id } = req.params;
  users = users.filter((user) => user.id !== Number(id));
  res.send("User deleted successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
