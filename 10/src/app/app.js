import express from "express";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Authentication Initialized")
})

app.post('/login', (req, res) => {
  // Handle login logic here
  res.send("Login endpoint")
})

export default app