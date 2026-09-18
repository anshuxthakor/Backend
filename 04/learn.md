# A Full CRUD API: Notes App

---

## 1. Routes Stop Living in `app.js`

Up to now, routes sat directly on `app`. Once there's more than a couple, that gets messy fast — so they move into their own file using `express.Router()`.

```js
const express = require("express");
const notesRouter = express.Router();

notesRouter.post("/create", createNotesController);
notesRouter.get("/notes", getAllNotesController);
notesRouter.get("/notes/:id", getSingleNoteController);
notesRouter.put("/update/:id", updateNoteController);
notesRouter.delete("/delete/:id", deleteNoteController);

module.exports = notesRouter;
```

`express.Router()` is a mini, self-contained version of `app` — it can hold its own routes and middleware, and gets plugged into the main app later.

## 2. Mounting a Router

```js
app.use("/api", notesRouter);
```

Every path inside `notesRouter` now sits behind `/api`. `/create` becomes `/api/create`, `/notes/:id` becomes `/api/notes/:id`. One line, and the entire router shifts under a shared prefix — this is also where API versioning (`/api/v1`) would eventually go.

## 3. The Model — Where Validation Actually Lives

```js
const notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    required: true,
    minLength: [20, "Description must be at least 20 characters long"],
  },
});

const NotesModel = mongoose.model("notes", notesSchema);
```

Validation rules belong on the schema, not scattered across every controller. `required: true` blocks an empty field; `minLength` with a custom message rejects anything under 20 characters and returns that exact message if it fails. Mongoose checks this automatically, before the document ever reaches MongoDB.

## 4. The Controller Pattern

Every controller in this project follows the same shape:

```js
const createNotesController = async (req, res) => {
  try {
    let { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    let newNote = await NotesModel.create({ title, description });
    res.status(201).json({ success: true, message: "Note created successfully", data: newNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Same skeleton every time:
1. Pull whatever's needed off `req`.
2. Manually check for the obvious stuff first (missing fields → `400`, before Mongoose even gets involved).
3. Do the actual DB operation inside `try`.
4. Send a consistent shape back — `{ success, message, data }`.
5. `catch` anything unexpected → `500`, with the error message attached.

## 5. Mongoose's CRUD Methods, One Per Operation

| Controller | Mongoose call | Notes |
|---|---|---|
| Create | `NotesModel.create({...})` | Runs schema validation automatically |
| Read all | `NotesModel.find()` | No filter = every document |
| Read one | `NotesModel.findById(id)` | Returns `null` if nothing matches → `404` |
| Update | `NotesModel.findByIdAndUpdate(id, data, { new: true })` | `{ new: true }` returns the *updated* doc, not the stale one |
| Delete | `NotesModel.findByIdAndDelete(id)` | Also returns `null` if nothing was found |

Every "not found" case is checked explicitly and returned as `404` — `findById` and friends don't throw an error on a missing document, they just resolve to `null`, so that has to be caught by hand.

## 6. Failing Loud on a Bad DB Connection

```js
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
```

`process.exit(1)` kills the process outright if the DB connection fails. An API with no working database isn't a smaller version of the app — it's broken, so it's better for it to crash immediately with a clear log than to keep running and fail confusingly on the first real request.

## 7. Status Codes, Actually Used Now

- `201` — a note was created
- `200` — a read, update, or delete succeeded
- `400` — the client sent something invalid (missing fields)
- `404` — the ID doesn't match any document
- `500` — anything unexpected on the server side

## 8. Testing It — Postman, All Five Routes

With the router mounted at `/api`, every route gets hit through Postman before any frontend exists:
`POST /api/create`, `GET /api/notes`, `GET /api/notes/:id`, `PUT /api/update/:id`, `DELETE /api/delete/:id` — same five operations from Day 04's CRUD table, now backed by an actual database instead of an array in memory.

---

## Key Takeaways

- `express.Router()` breaks routes out of `app.js` into their own file; `app.use("/api", router)` mounts the whole set under one prefix.
- Validation belongs on the Mongoose schema (`required`, `minLength`, custom messages) — not repeated inside every controller.
- Every controller follows the same shape: validate → try the DB call → respond consistently → catch and return `500` on failure.
- `findById`, `findByIdAndUpdate`, `findByIdAndDelete` return `null` instead of throwing when nothing matches — that has to be checked manually and turned into a `404`.
- `{ new: true }` on `findByIdAndUpdate` is what makes it return the updated document instead of the one before the update.
- `process.exit(1)` on a failed DB connection is intentional — crash loud immediately, rather than run silently broken.