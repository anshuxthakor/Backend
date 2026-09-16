# REST APIs & CRUD

---

## 1. What REST Actually Stands For

**RE**presentational **S**tate **T**ransfer. Not a protocol, not a library — an architectural style for how client and server talk to each other.

The core ideas:
- Everything the API touches is a **resource** (a user, a product, an order), and every resource has its own URI.
- Resources travel as a **representation** — almost always JSON.
- Communication is **stateless**: every request carries everything the server needs. The server doesn't remember the last request.

## 2. CRUD, Mapped to HTTP Methods

| Operation | HTTP Method | What it does |
|---|---|---|
| **C**reate | `POST` | Creates/saves something new |
| **R**ead | `GET` | Sends data back, doesn't touch the DB otherwise |
| **U**pdate | `PUT` / `PATCH` | Updates something existing |
| **D**elete | `DELETE` | Removes something |

`PUT` vs `PATCH` looks like a small difference until it isn't:
- `PUT` → replaces the **entire object**. Leave a field out, and it's gone.
- `PATCH` → updates **one field, or a few**, inside the object. Everything else stays untouched.

## 3. Is It Idempotent? Is It Safe?

Two properties every method gets tested on:

- **Idempotent** — calling it once or a hundred times with the same input leaves the server in the same end state. `GET`, `PUT`, `DELETE` qualify. `POST` doesn't — call it twice, get two resources. `PATCH` is a maybe, depending on what the patch actually does.
- **Safe** — doesn't modify anything on the server at all. `GET` is the obvious one. Every safe method is automatically idempotent; the reverse isn't true.

## 4. Anatomy of `req`

Four places data can arrive from on a single request:

| Part | What it carries | Example |
|---|---|---|
| `req.body` | Data sent from the frontend, parsed as JSON | `{ name: "Daksh" }` |
| `req.query` | Extra key-value pairs in the URL, often pagination | `?limit=10&skip=0` |
| `req.params` | Dynamic pieces of the path itself | `/product/:id` |
| `req.files` | Media/file uploads | image, PDF, etc. |

`req.body` only exists because of `express.json()` — without that middleware sitting in front of every route, Express has no idea how to read the incoming data, and `req.body` stays empty.

## 5. Status Codes, By Class

| Range | Meaning |
|---|---|
| 1xx | Received, still processing |
| 2xx | Success |
| 3xx | Redirection — client needs to take further action |
| 4xx | Client error — bad request, missing auth, etc. |
| 5xx | Server error — something broke on the backend |

The ones that come up constantly: `200` OK, `201` Created (after a successful POST), `204` No Content (after a successful DELETE), `400` Bad Request, `401` Unauthorized, `404` Not Found, `500` Internal Server Error.

## 6. Full CRUD, In Express

```js
const express = require("express");
const app = express();
app.use(express.json());

let users = [];

// CREATE
app.post("/create", (req, res) => {
  users.push(req.body);
  res.send("User created successfully");
});

// READ
app.get("/users", (req, res) => {
  res.send(users);
});

// UPDATE
app.put("/update/:id", (req, res) => {
  let { id } = req.params;
  users = users.map((user) =>
    user.id === Number(id) ? { ...user, ...req.body } : user
  );
  res.send("User updated successfully");
});

// DELETE
app.delete("/delete/:id", (req, res) => {
  let { id } = req.params;
  users = users.filter((user) => user.id !== Number(id));
  res.send("User deleted successfully");
});
```

Every route here maps directly to the CRUD table above — same four operations, just written out.

## 7. Postman — The Virtual Frontend

Before a real frontend exists, Postman plays that role: it sends requests (with a body, query, or params, whichever the route needs) straight at the API and shows the raw response. It's how an endpoint gets tested the moment it's written, without waiting on any UI.

## 8. A Few REST Design Habits (from the reference notes)

- URLs are nouns, not verbs — `/users`, not `/getUsers`.
- Collections are plural — `/users`, and `/users/:id` for one of them.
- Keep the method doing what its name says, nothing more.
- Version the API early — `/api/v1/users` — so changes later don't break whoever's already using it.

---

## Key Takeaways

- REST is a style, not a protocol: stateless requests, resources identified by a URI, JSON as the representation.
- CRUD maps cleanly onto HTTP methods — Create→POST, Read→GET, Update→PUT/PATCH, Delete→DELETE.
- `PUT` replaces the whole object; `PATCH` touches only what's passed in.
- Idempotent means "same result no matter how many times you call it" — safe means "doesn't touch the server's data at all." Every safe method is idempotent, not every idempotent method is safe.
- `req` has four distinct sources of data — `body`, `query`, `params`, `files` — and each one exists for a different kind of input.
- Status codes aren't decoration — they're the fastest way for a client to know what happened without parsing the response body.