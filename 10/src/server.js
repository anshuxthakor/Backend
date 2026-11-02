import "dotenv/config";
import app from './app/app.js';
import connectToDatabase from './config/db.js'

const PORT = process.env.PORT || 3000;

await connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});