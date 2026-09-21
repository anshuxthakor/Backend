# Day 09 — File Handling with Multer

---

## 1. Why `express.json()` Isn't Enough

`express.json()` only understands one content type — JSON. A file upload comes in as `multipart/form-data`, a completely different shape, part text fields and part raw binary. Express has no built-in way to parse that, which is exactly the gap **Multer** fills — it's middleware built specifically to read `multipart/form-data` and hand back a usable `req.file` (or `req.files`).

## 2. Two Ways to Store What Multer Receives

### Disk Storage — write straight to the server's filesystem

```js
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
```

- `destination` — which folder the file lands in.
- `filename` — what it gets named. `Date.now() + "-" + file.originalname` avoids two uploads silently overwriting each other if they share a name.
- Both callbacks follow the same `(req, file, cb)` shape, and `cb(null, value)` is how each one hands its result back to Multer — `null` for "no error," then the actual value.

### Memory Storage — keep it as a Buffer, don't touch the disk

```js
const memoryStorage = multer.memoryStorage();
```

No `destination`, no `filename` — the file never touches disk at all. It stays in RAM as a `Buffer`, sitting on `req.file.buffer`, ready to be sent straight to wherever it's actually supposed to end up (a cloud storage service, most commonly).

## 3. What a Buffer Actually Is

A `Buffer` is Node's way of holding raw binary data in memory — not text, not JSON, just bytes. An image, a PDF, a video: none of that is naturally a JS string, so Node represents it as a `Buffer` until it's written to disk, sent over the network, or converted into something else. `memoryStorage()` is Multer choosing to hand you that raw `Buffer` directly instead of writing it to a file first.

## 4. Wiring It to a Route

```js
const diskUpload = multer({ storage: diskStorage });
const memoryUpload = multer({ storage: memoryStorage });

fileRouter.post("/disk", diskUpload.single("diskimage"), (req, res) => {
  let file = req.file;
  res.status(200).json({ message: "File uploaded successfully" });
});
```

`.single("diskimage")` — one file, and `"diskimage"` has to match the field name the client sends it under. `req.file` holds everything about it: `fieldname`, `originalname`, `mimetype`, `size`, plus `path`/`filename` for disk storage or `buffer` for memory storage. (Multer also has `.array()` for multiple files under one field, and `.fields()` for several differently-named file fields at once.)

## 5. Middleware — Two Layers, Set Up Differently

Every request passes through middleware before it reaches a route's actual logic. Middleware is just a function with access to `req`, `res`, and `next` — it can inspect or change the request, then hand off to whatever comes next by calling `next()`. Two different places it gets registered in this project:

### Global — `app.use()`, in `app.js`, runs on every request

```js
app.use(express.json());
```

This sits above every route, so it's true for the whole app, no exceptions. `express.json()` lives here because almost any route might need `req.body` parsed — attaching it per-route would mean repeating it everywhere.

### Route-specific — placed directly inside one route's definition

```js
fileRouter.post("/disk", diskUpload.single("diskimage"), (req, res) => {
  // req.file already exists by the time this runs
});
```

`diskUpload.single("diskimage")` only runs for this one route, on purpose. Most routes never receive a file, so parsing `multipart/form-data` globally would be wasted work on every request that doesn't need it. Multer sits between the path and the handler, does its parsing, then calls `next()` internally — by the time the handler function runs, `req.file` is already populated.

### Order Is Not Optional

Middleware runs top to bottom, in exactly the order it's written. `app.use(express.json())` has to come before any route reading `req.body`, or that route sees an unparsed body. Same rule inside a single route: `diskUpload.single(...)` has to come *before* the handler in the arguments list — it's literally what creates `req.file` before the handler ever sees the request.

| Middleware | Scope | Registered in | Runs on |
|---|---|---|---|
| `express.json()` | Global | `app.js` | Every request |
| `cors({ origin })` | Global | `app.js` | Every request |
| `diskUpload.single(...)` / `memoryUpload.single(...)` | Route-specific | route file | Only that one route |

## 6. Why Two Storage Types Exist At All

- **Disk storage** — fine for quick local testing, or when the server itself is meant to hold the files.
- **Memory storage** — the one that actually matters in a real app, because the file, as a `Buffer`, can be forwarded immediately to a cloud storage service without ever wasting a write to the server's own disk.

## 7. Where the File Actually Belongs — Not in MongoDB

Text and structured data — titles, descriptions, user info — belongs in MongoDB, as JSON documents. Large binary files do not. Storing images or videos directly inside MongoDB is possible but wasteful — it bloats the database, slows down queries, and MongoDB was never built to serve media efficiently.

The real pattern: the actual file goes to a dedicated storage service — **ImageKit**, **Cloudinary**, or **AWS S3** — and only the **URL** that service returns gets saved in MongoDB, as just another field on the document. MongoDB never sees the binary data at all.

| | Handles | Example |
|---|---|---|
| MongoDB | Structured/text data | `{ title, description, imageUrl }` |
| ImageKit / Cloudinary / S3 | Media/binary data | the actual image or video file |

## 8. Storage vs. CDN — Not the Same Thing

- **Object storage** (S3, or the storage layer behind Cloudinary/ImageKit) — where the file actually, physically lives. One location.
- **CDN** (Content Delivery Network) — a network of servers spread across different geographic regions, each caching a copy of that file close to wherever a user actually is, so it loads fast no matter where they're requesting it from.

Plain S3 is storage only — pairing it with a CDN (like AWS's own CloudFront) is a separate step. Cloudinary and ImageKit bundle both together by default: upload once, and the file is already stored *and* served through their CDN, often with on-the-fly image transformations (resizing, compression) thrown in.

## 9. The Setup, In Order

1. `npm install multer`.
2. A config file (`config/multer.js`) defining `diskStorage`/`memoryStorage` and exporting `diskUpload`/`memoryUpload`.
3. A route file where the upload middleware sits directly in front of the controller: `router.post("/disk", diskUpload.single("fieldname"), controller)`.
4. Mount that router in `app.js`, same as any other router.

---

## Key Takeaways

- Multer exists because `express.json()` can't parse `multipart/form-data` — file uploads need their own middleware.
- `diskStorage` writes straight to the server's filesystem; `memoryStorage` keeps the file as a `Buffer` in RAM, ready to forward elsewhere.
- A `Buffer` is Node's representation of raw binary data — the natural form for anything that isn't text before it's written or sent somewhere.
- `.single(field)` for one file, `.array(field)` for several under one name, `.fields([...])` for multiple named file inputs.
- Middleware runs in the order it's registered: global middleware (`app.use`) applies to every request and must sit above the routes; route-specific middleware (like `diskUpload.single(...)`) only runs for the one route it's placed in, and must come before that route's handler since it's what populates `req.file` in the first place.
- Media doesn't belong in MongoDB — it goes to a dedicated storage service (ImageKit/Cloudinary/S3), and only the resulting URL is saved as a normal field on the document.
- Storage and CDN are different jobs — storage is where the file lives, a CDN is what makes it load fast everywhere. Cloudinary and ImageKit give you both by default; S3 gives you storage and needs a CDN paired on top.