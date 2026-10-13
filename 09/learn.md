# JSON Web Tokens (JWT)

---

## 1. The Problem JWT Solves

REST is stateless (Day 04): the server doesn't remember the last request. So after a user registers or logs in, how does the next request prove who it's from, without sending the password every time?

The server hands the client a **token** once. The client sends that token back with every later request. The server checks the token, and that's the proof.

## 2. What a JWT Actually Is

A JWT is a string in three parts, separated by dots:

```
header.payload.signature
```

| Part | Contains |
|---|---|
| **Header** | The signing algorithm (HS256 by default) and token type |
| **Payload** | The data (claims) you put in, like `email` and `name`, plus `iat` (issued-at) added automatically |
| **Signature** | A hash of the header + payload, made with your secret key |

The signature is the important part. Change a single character in the payload and the signature no longer matches, so the server can tell the token was tampered with.

## 3. Signing a Token

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { email, name },
  process.env.JWT_SECRET_KEY
);
```

`jwt.sign(payload, secret)` returns the token string. The secret is what makes the signature impossible to fake, so it lives in `.env` and is read through `process.env`, same rule as the database URI and the ImageKit keys.

## 4. The Register Route

```js
app.post("/api/auth/register", (req, res) => {
  const { email, name, password } = req.body;

  const token = jwt.sign({ email, name }, process.env.JWT_SECRET_KEY);

  res.status(201).json({
    message: "User registered successfully",
    data: { user: { email, name }, token },
  });
});
```

- `201` because a new user was created.
- The response sends back the user's public details plus the `token`.
- The payload has a `// _id` comment: once users are saved in MongoDB, the document's `_id` is the better thing to put in the token, since email can change.

## 5. `import "dotenv/config"`

```js
import "dotenv/config";
import app from "./app/app.js";
```

Day 11's hoisting problem, solved in one line. `dotenv/config` is a side-effect import: simply importing it loads `.env`. Because it's the first import, the variables exist before any file after it runs.

## 6. A JWT Is Signed, Not Secret

The payload is only base64-encoded, not encrypted. Anyone holding the token can decode it and read the payload (paste one into jwt.io to see). The signature stops people from **changing** it, not from **reading** it.

So the payload never gets a password or anything private. Names, emails and ids only.

## 7. Where It Goes Next

The client stores the token and sends it on later requests, usually in a header:

```
Authorization: Bearer <token>
```

A middleware then calls `jwt.verify(token, secret)` before the route runs. If the signature checks out, it passes the request on; if not, it responds `401`. That verify step is the other half of JWT.

## 8. Things to Tighten Next

- **Hash the password** (bcrypt) before saving. Right now `password` is read from the body but never used.
- **Set an expiry:** `jwt.sign(payload, secret, { expiresIn: "1d" })`. Without it, a token is valid forever.
- **Save the user** to MongoDB and put `_id` in the payload.
- **Add `jwt.verify`** in an auth middleware to protect routes.

---

## Key Takeaways

- A JWT lets a stateless server recognise a returning client: issue once, verify on every request.
- A token is `header.payload.signature`. The signature, made with the secret key, is what makes tampering detectable.
- `jwt.sign(payload, secret)` creates it, `jwt.verify(token, secret)` checks it.
- The secret key lives in `.env` and is never committed or shared.
- The payload is readable by anyone, so it holds identifiers, never passwords.
- Without `expiresIn`, a token never expires.
- `import "dotenv/config"` as the first import loads the environment before any other file runs.