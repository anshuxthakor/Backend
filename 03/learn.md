# Connecting to a Database

---

## 1. Why the Project Suddenly Has Three Files Instead of One

Up to Day 04, everything lived in one `server.js`. That stops scaling the moment a database enters the picture, so the project splits along what each piece is actually responsible for:

| File | Job |
|---|---|
| `server.js` | Entry point — loads env variables, connects to the DB, starts the server |
| `src/app.js` | The actual Express app — middleware, routes, nothing about the server starting |
| `src/config/db.js` | Just the database connection logic, exported as a function |

```js
// server.js
require("dotenv").config();
const app = require("./src/app");
const connectToDatabase = require("./src/config/db");

connectToDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
```

`server.js` doesn't know how Express is configured, and `app.js` doesn't know how the DB connects. Each file does exactly one job.

## 2. `dotenv` — Keeping Secrets Out of the Code

```js
require("dotenv").config();
```

This one line reads a `.env` file sitting in the project root and loads every key-value pair inside it into `process.env`. Things like `PORT` and `MONGO_URI` never get hardcoded or pushed to GitHub — they live in `.env`, which stays out of version control, and the code just reads `process.env.MONGO_URI` without knowing or caring what the actual value is.

## 3. Mongoose — Why Not Just Use MongoDB Directly

MongoDB on its own is schema-less — any document can look like anything, which is flexible but easy to break. **Mongoose** is an ODM (Object Data Modeling library) that sits on top of MongoDB and gives structure back:

- **Schemas** — define what fields a document should have, and what type each one is.
- **Models** — a schema turned into something you can actually query, create, and update through.
- **Validation** — built in, before anything even reaches the database.
- A much cleaner query syntax than the raw MongoDB driver.

```js
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToDatabase;
```

`mongoose.connect()` is asynchronous, so it's wrapped in `try/catch` — if the URI is wrong or the DB is unreachable, the error gets caught and logged instead of crashing silently.

## 4. Local vs Atlas — Two Ways to Point `MONGO_URI`

| | Local | Atlas |
|---|---|---|
| Where it runs | Your own machine | MongoDB's cloud, in a real data center |
| Connection string | `mongodb://localhost:27017/dbname` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| Needs | MongoDB installed and running locally | An Atlas account, a cluster, whitelisted IP, DB user |

Same `mongoose.connect()` call either way — only the string in `.env` changes. That's the entire point of pulling it out into an env variable in the first place.

## 5. Compass — Seeing the Database Instead of Guessing

MongoDB Compass is the GUI for whatever's sitting inside a MongoDB instance — local or Atlas. Instead of querying blind, Compass shows the actual databases, collections, and documents, lets you filter, edit, and delete visually, and is usually the fastest way to confirm data actually landed where the code says it did.

## 6. MVC — Where Every File Is Supposed to Live

| Layer | Responsibility | Lives in |
|---|---|---|
| **Model** | Schema + shape of the data | `src/models/` |
| **View** | What gets sent back (in a pure API, this is just JSON) | response itself |
| **Controller** | The actual logic behind each route | `src/controllers/` |
| Routes | Maps a URL + method to a controller function | `src/routes/` |
| Config | DB connection, env setup | `src/config/` |

`app.js` stays thin — it wires routes to the app, nothing more. All the real logic moves into controllers, and all the shape of the data moves into models. Nothing about a request's actual behavior lives in `app.js` or `server.js` anymore.

---

## Key Takeaways

- `server.js`, `app.js`, and `db.js` split apart because each has exactly one job — starting the server, configuring Express, and connecting the database respectively.
- `dotenv` loads `.env` into `process.env` so secrets like `MONGO_URI` never sit inside the actual code.
- Mongoose adds schemas, models, and validation on top of MongoDB's schema-less documents — structure MongoDB doesn't give you on its own.
- Local and Atlas connections use the exact same `mongoose.connect()` call — only the connection string differs.
- Compass is the GUI for actually seeing what's inside the database, instead of trusting the terminal output.
- MVC keeps `app.js` thin: models hold data shape, controllers hold logic, routes just point a URL at the right controller.