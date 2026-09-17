require('dotenv').config();
const app = require('./src/app');
const connectToDatabase = require('./src/config/database');

connectToDatabase()

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});