// Server ko start karna and database se connect karna.
require('dotenv').config();
const connectToDatabase = require('./src/config/database');
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});