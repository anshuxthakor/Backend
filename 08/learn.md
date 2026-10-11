# ImageKit: Sending Uploads to the Cloud (MiniInsta)

---

## 1. The Plan: Multer Catches It, ImageKit Keeps It

Day 09 ended on an idea: media doesn't belong in MongoDB. Today that idea became code. The flow for one post:

1. The client sends an image + caption as `multipart/form-data`.
2. **Multer** (memory storage) catches the image as a `Buffer`.
3. A **storage service** forwards that buffer to **ImageKit**.
4. ImageKit stores it, serves it through its CDN, and returns an object that includes the file's URL.
5. That URL (not the file) is what gets saved in MongoDB next to the caption.

## 2. Folder Structure

```
src/
├── config/
│   ├── db.js
│   └── multer.config.js
├── controllers/post.controller.js
├── models/post.model.js
├── routes/post.route.js
├── services/storage.service.js
└── app.js
server.js
```

A new folder showed up: `services/`. Anything that talks to an outside service (here, ImageKit) lives there, so controllers never need to know how the upload actually works.

## 3. ES Modules Instead of CommonJS

This project switched from `require` to `import`/`export`:

```js
import express from "express";
export default app;
```

It needs `"type": "module"` in `package.json` (Day 02's `"type": "commonjs"` row, flipped). Two things changed with it:
- Local imports **must include the file extension** — `./routes/post.route.js`, not `./routes/post.route`.
- **Top-level `await`** works, so `server.js` can simply do `await connectToDatabase();` before starting the server, with no wrapping function.

## 4. Multer Config, Memory Only

```js
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
```

Memory storage is the right pick here because the file never needs to exist on the server's disk. It arrives as `req.file.buffer` and goes straight to ImageKit.

## 5. The Storage Service

```js
import ImageKit from "@imagekit/nodejs";
import { configDotenv } from "dotenv";

configDotenv();

const storageInstance = new ImageKit({
  urlEndpoint: process.env.URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const sendFiles = async (file, fileName) => {
  const obj = { file, fileName, folder: "MiniInsta" };
  return await storageInstance.files.upload(obj);
};

export default sendFiles;
```

- The ImageKit client is created **once**, with credentials read from `.env`. The private key never appears in the code.
- `configDotenv()` is called inside this file on purpose. With ES modules, all `import`s are hoisted and run before the rest of `server.js`, so `server.js`'s own `dotenv.config()` hasn't run yet when this file loads. Calling it here guarantees the keys exist.
- `sendFiles(file, fileName)` takes the buffer and the original filename. `folder: "MiniInsta"` keeps this project's uploads grouped in one folder inside the ImageKit media library.
- It returns whatever ImageKit sends back, which includes the hosted file's `url`.

## 6. Route and Controller

```js
postRouter.post("/create", upload.single("image"), createPostController);
```

```js
export const createPostController = async (req, res) => {
  const { caption } = req.body;
  const file = req.file;
  if (!caption || !file) {
    return res.status(400).json({ success: false, message: "Caption and image are required" });
  }
  const uploadImage = await sendFiles(file.buffer, file.originalname);
  console.log(uploadImage);
  // ...save caption + uploadImage.url to MongoDB
};
```

Same layered shape as before: `upload.single("image")` runs first (the field name must match what the frontend appends), then the controller checks for the obvious missing pieces with a `400`, then hands the buffer to the service.

## 7. The Model

```js
const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });
```

`imageUrl` is just a string. MongoDB holds text; ImageKit holds the picture. `timestamps: true` adds `createdAt` and `updatedAt` automatically.

## 8. Things to Tighten Next

- The `postModel.create({ caption, imageUrl: uploadImage.url })` call is still commented out, and the response references a `post` variable that doesn't exist until that line is back. Un-comment the create and the response works.
- The controller has no `try/catch`. If the ImageKit upload fails (bad key, network), the request errors out instead of returning a clean `500` like the Day 06 controllers do.

---

## Key Takeaways

- The upload pipeline is Multer (catch the buffer) → storage service (forward it) → ImageKit (store + serve via CDN) → MongoDB (save only the URL).
- Third-party integrations belong in `services/`, so controllers stay about requests and responses, not SDK details.
- ES modules need `"type": "module"`, explicit `.js` extensions on local imports, and bring top-level `await`.
- Imports are hoisted in ES modules, so a file that needs env variables at load time has to call `dotenv` itself.
- Credentials (`URL_ENDPOINT`, public key, private key) live in `.env` and are read through `process.env`, never written into the code.
- `imageUrl` in the schema is a plain string: the database stores a pointer, ImageKit stores the file.