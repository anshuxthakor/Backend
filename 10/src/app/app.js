import express from "express";

const app = express();

app.get('/', (req, res) => {
  res.send("Authentication Initialized")
})

export default app