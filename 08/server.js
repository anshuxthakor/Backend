import app from './src/app.js';
import dotenv from 'dotenv';
import { connectToDatabase } from './src/config/db.js';

dotenv.config();

await connectToDatabase();

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});