# FormData: Sending Files From React to Multer

---

## 1. Why JSON Stops Working the Moment a File Is Involved

Every request so far has been `axios.post(url, { ...data })` — plain JSON, handled by `express.json()` on the backend. A file can't travel inside JSON; it's binary, not text. The browser's own answer to that is `FormData` — a format built specifically to carry a mix of regular fields and actual files in one request.

```js
const submitHandler = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  for (let i = 0; i < data.images.length; i++) {
    formData.append("images", data.images[i]);
  }
  await axios.post("http://localhost:3000/api/upload", formData);
};
```

`formData.append(key, value)` adds one entry at a time. Text fields (`name`, `email`) get appended once each. Files are different — `data.images` from a `<input type="file" multiple />` is a `FileList`, not an array, so it's looped and each file gets appended under the **same** key, `"images"`, repeated once per file.

## 2. Why the Same Key, Repeated

Appending multiple values under one key — `images`, `images`, `images` — is exactly what tells the backend "these all belong together, as a group." That's the piece that lets Multer's `.array()` (below) treat them as one field with several files, instead of needing a separate field name per file.

## 3. `register("images")` — Grabbing a `FileList` Through `react-hook-form`

```jsx
<input
  className="inpfile"
  multiple
  {...register("images")}
  type="file"
/>
```

No `required` validation here — `register` just wires the file input into the form's data object under `data.images`. What lands there is a native `FileList`, which is why the submit handler loops over it with a plain `for` instead of `.map()` — `FileList` isn't a real array and doesn't have array methods by default.

## 4. Not Setting `Content-Type` Manually — On Purpose

Notice the `axios.post` call never sets a `Content-Type` header. Axios (and the browser) sets it automatically to `multipart/form-data`, along with a `boundary` — a unique marker separating each field and file inside the request body. Setting it manually would break that boundary and the backend would fail to parse anything correctly.

## 5. Backend: `.array()` Instead of `.single()`

```js
userRouter.post("/upload", upload.array("images"), createController);
```

`.single("images")` expects exactly one file. `.array("images")` expects any number of files, all under that same field name — which is exactly what the frontend just sent. The field name passed to `.array()` has to match the key used in every `formData.append("images", ...)` call, or Multer won't pick the files up at all.

## 6. `req.body` vs `req.files` — Two Different Places

```js
const createController = (req, res) => {
  console.log(req.body);  // { name: "...", email: "..." }
  console.log(req.files); // [ { fieldname, originalname, mimetype, size, buffer }, ... ]
  res.status(200).json({ message: "Files uploaded successfully" });
};
```

Multer splits the request for you: plain text fields land in `req.body`, exactly like a normal form. Files land separately in `req.files` — plural, because `.array()` can return more than one — as a list of file objects, each carrying its own `buffer` since this project uses `memoryStorage`.

## 7. The Full Chain, Traced

1. User fills the form, selects multiple images.
2. `submitHandler` builds one `FormData` object — 2 text fields, N files, all under `"images"`.
3. `axios.post` sends it as `multipart/form-data`, boundary set automatically.
4. Request hits `/api/upload` — `express.json()` doesn't touch it (wrong content type for that), `cors()` checks the origin.
5. `upload.array("images")` middleware runs first, parses the body, splits it into `req.body` and `req.files`.
6. `createController` runs last, with both already populated.

Same layered-middleware idea from Day 09 — global middleware (`express.json`, `cors`) checked first, then the route-specific one (`upload.array`), and only then the actual handler.

---

## Key Takeaways

- `FormData` exists because JSON can't carry binary files — it's the browser's native way to mix text fields and files in one request.
- `formData.append(key, value)` called multiple times with the **same key** is how several files get grouped under one field, matching what Multer's `.array()` expects on the other end.
- A file input's value through `register()` is a `FileList`, not a real array — loop it with a plain `for`, not `.map()`.
- Never set `Content-Type` manually on a `FormData` request — axios/the browser sets it, boundary included, and overriding it breaks parsing.
- `.array(fieldname)` on the backend must match the exact key used in every `append()` call on the frontend, or the files won't be picked up.
- Multer splits the request into `req.body` (text fields) and `req.files` (the array of uploaded files) — same middleware-before-handler order as any other route.