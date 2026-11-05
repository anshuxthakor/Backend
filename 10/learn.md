# Authentication with Express, MongoDB, bcrypt, and JWT

This guide explains how to build a small authentication system

- **Node.js and Express** for the HTTP server and API routes
- **MongoDB and Mongoose** for storing user records
- **bcrypt** for securely hashing passwords
- **JSON Web Tokens (JWTs)** for authenticating later requests
- **dotenv** for loading configuration and secrets from environment variables

The examples use **ECMAScript modules (ESM)** because this project has `"type": "module"` in `package.json`. That means imports use `import` and local JavaScript imports include the `.js` extension.

> Authentication examples are useful for learning, but production systems need additional controls such as rate limiting, account recovery, email verification, audit logging, and secure secret management.

---

## 1. Authentication and authorization

Authentication and authorization are related, but they answer different questions:

- **Authentication** asks, “Who is this user?”
- **Authorization** asks, “Is this user allowed to perform this action?”

For example, logging in with an email and password authenticates a user. Checking whether that user is an administrator before allowing access to `/admin/users` is authorization.

A typical authentication flow looks like this:

1. A user sends their name, email, and password to **register**.
2. The server validates the data.
3. The server hashes the password and stores only the hash in MongoDB.
4. The user sends their email and password to **log in**.
5. The server finds the account and compares the submitted password with the stored hash.
6. If the credentials are valid, the server signs a JWT.
7. The client sends that JWT with future protected requests.
8. Middleware verifies the JWT, loads the user, and allows the route handler to run.

The server must never need to know the original password after registration. It should only retain a one-way password hash.

---

## 2. How the main packages fit together

| Package | Responsibility |
|---|---|
| `express` | Creates the server, parses requests, and defines routes and middleware. |
| `mongoose` | Connects to MongoDB and maps JavaScript objects to MongoDB documents. |
| `bcrypt` | Creates password hashes and compares passwords with existing hashes. |
| `jsonwebtoken` | Signs and verifies compact, tamper-evident tokens. |
| `dotenv` | Loads values from `.env` into `process.env`. |

These packages solve different problems. JWT does not hash passwords, bcrypt does not create login sessions, and Mongoose does not validate whether a password is correct.

---

## 3. Password hashing with bcrypt

### Why plain-text passwords are unsafe

Storing this document would be a serious security problem:

```json
{
  "email": "person@example.com",
  "password": "secret123"
}
```

If the database or a database backup is exposed, the attacker immediately knows the password. Users also commonly reuse passwords on other websites, so one leak can affect many accounts.

Instead, the database should contain a bcrypt hash:

```text
secret123 -> $2b$10$N9qo8uLOickgx2ZMRZoMye...
```

A hash is designed to be one-way. The application does not decrypt it during login. It asks bcrypt to compare the submitted password against the stored hash:

```js
import bcrypt from "bcrypt";

const passwordHash = await bcrypt.hash("secret123", 12);
const isCorrect = await bcrypt.compare("secret123", passwordHash);

console.log(isCorrect); // true
```

### Salt and cost

bcrypt automatically includes a random **salt** in each hash. Therefore, two users with the same password should still receive different hashes.

The cost factor controls how much work bcrypt performs. A higher value makes password guessing more expensive, but also makes registration and login slower. Choose a value appropriate for the production hardware and measure it rather than copying a value blindly. The examples below use `12`; a project may choose another value after testing.

Never:

- hash passwords with plain SHA-256 or MD5
- compare passwords with `===`
- log passwords or password hashes
- hash a password again every time an unrelated user field is saved

---

## 4. JWTs and protected requests

A JWT is a signed string that commonly contains:

- a **header** describing the signing algorithm
- a **payload** containing claims such as the user ID and expiration time
- a **signature** proving that the token was created with the server’s secret

The payload is encoded, not encrypted. Do not put passwords, secrets, or sensitive personal data inside it.

Signing a token:

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user._id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

Verifying a token:

```js
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

`jwt.verify()` checks the signature and expiration. It must be used instead of merely decoding the token. A decoded token has not been proven trustworthy.

The client sends a token in the standard authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The token is not a permanent identity. It expires, and the server should reject it after expiration. For browser applications, an `httpOnly`, `secure`, appropriately configured cookie is often safer than storing a token in `localStorage`, because JavaScript cannot directly read an `httpOnly` cookie.

---

## 5. Project structure

The current project already separates startup, database configuration, and the Express application:

```text
10/
├── src/
│   ├── app/
│   │   └── app.js              # Express app and middleware
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   └── server.js               # Environment loading and server startup
├── .env                        # Local secrets; do not commit
├── package.json
└── learn.md
```

A fuller authentication implementation can add these modules:

```text
src/
├── app/
│   └── app.js
├── config/
│   └── db.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   └── user.model.js
├── routes/
│   └── auth.routes.js
└── server.js
```

Keeping the model, routes, and middleware separate makes each responsibility easier to test and change.

---

## 6. Installation and environment variables

From the project directory:

```bash
npm install express mongoose bcrypt jsonwebtoken dotenv
```

The project already uses a development script:

```bash
npm run dev
```

Create a local `.env` file:

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/authdb
JWT_SECRET=replace-this-with-a-long-random-secret
```

`JWT_SECRET` must be long, random, and different between environments. Generate it securely rather than using a phrase from source control. Do not commit `.env`; add it to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

An `.env.example` file may document variable names without containing real credentials:

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/authdb
JWT_SECRET=
```

The application should fail during startup when required configuration is missing, rather than silently running with an empty database URL or signing secret.

---

## 7. The User model

Create `src/models/user.model.js`:

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
```

### Important model details

- `required` ensures the field is present when Mongoose validates the document.
- `trim` removes accidental whitespace around names and email addresses.
- `lowercase` normalizes emails before storage. Normalize the login email in the same way.
- `unique: true` creates a uniqueness index; it is not a replacement for handling duplicate-key errors.
- `select: false` prevents the password hash from being returned by ordinary queries. Login must explicitly request it.
- `timestamps: true` adds `createdAt` and `updatedAt`.
- The `pre("save")` hook hashes only when `password` changed.

The `unique` constraint can still race when two registrations arrive at the same time. The route should catch MongoDB duplicate-key errors and return a suitable conflict response.

When logging in, request the password explicitly:

```js
const user = await User.findOne({ email }).select("+password");
```

After comparing, never include the password field in the response.

---

## 8. Authentication routes

Create `src/routes/auth.routes.js`:

```js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: createToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    const passwordMatches =
      user && (await user.comparePassword(password));

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: createToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
```

The register and login endpoints intentionally do not reveal whether a login failure came from an unknown email or a wrong password. Detailed errors help attackers enumerate accounts.

In a complete application, add schema validation before database operations. Validate email format, password length, name length, and unexpected fields with a library such as Zod or express-validator. Validation is separate from authentication: it checks the shape of input, not whether the credentials belong to a user.

---

## 9. Protecting routes with middleware

Create `src/middleware/auth.middleware.js`:

```js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function protect(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return next(error);
  }
}

export default protect;
```

Middleware runs before the protected route. It:

1. Checks that the authorization header uses the `Bearer` format.
2. Verifies the token signature and expiry.
3. Loads the current user from MongoDB.
4. Places the user on `req.user`.
5. Calls `next()` only when the request is authenticated.

Loading the user on every protected request ensures the account still exists and allows revoked or disabled accounts to be rejected. It also means the route receives current user data instead of trusting arbitrary claims from the token.

---

## 10. Connecting the routes to the application

Update `src/app/app.js`:

```js
import express from "express";
import authRoutes from "../routes/auth.routes.js";
import protect from "../middleware/auth.middleware.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoutes);

app.get("/api/auth/profile", protect, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

export default app;
```

`express.json()` must be registered before routes that read `req.body`. The request-size limit reduces unnecessary memory use for an endpoint that expects small JSON objects.

The existing `src/server.js` connects to MongoDB before starting the HTTP server:

```js
import "dotenv/config";
import app from "./app/app.js";
import connectToDatabase from "./config/db.js";

const PORT = process.env.PORT || 3000;

await connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Starting the listener only after a successful database connection prevents the server from accepting requests that it cannot fulfill.

---

## 11. End-to-end request flow

```text
REGISTER
Client
  -> POST /api/auth/register
  -> Express parses JSON
  -> validate and normalize input
  -> check for an existing email
  -> Mongoose pre-save hook hashes the password
  -> MongoDB stores the user and hash
  -> server returns a JWT

LOGIN
Client
  -> POST /api/auth/login
  -> normalize the email
  -> find the user and explicitly select the password hash
  -> bcrypt.compare(submitted password, stored hash)
  -> return a JWT only when they match

PROTECTED REQUEST
Client
  -> GET /api/auth/profile
  -> Authorization: Bearer <token>
  -> middleware verifies the JWT
  -> middleware loads the user
  -> route handler reads req.user
  -> server returns protected data
```

JWT verification proves that the token was signed by the server, but it does not by itself prove that the account still exists or is still enabled. That is why the middleware also queries the user.

---

## 12. Testing with curl

Start MongoDB, set the environment variables, and run the server:

```bash
npm run dev
```

Register a user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"secret123\"}"
```

The response contains a token. Login returns another token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"secret123\"}"
```

Use the token in a protected request. Replace `<TOKEN>` with the actual token and do not include the angle brackets:

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

Useful negative tests include:

```bash
# Wrong password: should return 401
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"wrong-password\"}"

# Missing token: should return 401
curl http://localhost:3000/api/auth/profile

# Malformed token: should return 401
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer not-a-real-token"
```

Inspect MongoDB after registration. The `password` field must contain a bcrypt hash such as `$2b$12$...`, never `secret123`.

---

## 13. Security checklist

### Passwords and users

- Hash passwords with bcrypt before storage.
- Never return or log password hashes.
- Require a reasonable minimum password length and enforce a maximum input size.
- Use the same public error message for an unknown email and a wrong password.
- Handle duplicate email indexes instead of relying only on a preliminary `findOne`.

### Tokens and secrets

- Keep `JWT_SECRET` outside source control.
- Use a cryptographically random secret with enough length.
- Set a finite token expiry.
- Verify tokens; do not trust values returned by `jwt.decode()`.
- Put only non-sensitive identifiers in JWT payloads.
- Consider short-lived access tokens with a separate refresh-token strategy for longer sessions.

### HTTP and application controls

- Use HTTPS in production.
- Add rate limiting to registration and login.
- Add `helmet` and configure CORS with a restricted allow-list.
- Validate request bodies with a schema.
- Limit request body size.
- Use secure, `httpOnly`, `sameSite` cookies when the browser authentication design calls for cookies.
- Log security events without logging credentials or tokens.
- Keep dependencies patched and review authentication changes carefully.

---

## 14. Common mistakes and fixes

| Mistake | Why it causes trouble | Fix |
|---|---|---|
| Forgetting `express.json()` | `req.body` is unavailable for JSON requests. | Register it before the routes. |
| Using CommonJS in this project | `"type": "module"` expects ESM syntax. | Use `import`/`export` and `.js` on local imports. |
| Hashing in the route and in the model hook | The password can be hashed twice and never match. | Choose one hashing location; the model hook centralizes it. |
| Omitting `isModified("password")` | Saving a profile can hash an existing hash again. | Hash only when the password changed. |
| Forgetting `.select("+password")` | `select: false` keeps the hash out of the login query. | Explicitly select it only for comparison. |
| Using `bcrypt.compare()` without `await` | The function returns a Promise, which is truthy. | Await the comparison. |
| Comparing passwords with `===` | A password is not equal to its hash. | Use `bcrypt.compare()`. |
| Using `jwt.decode()` as authentication | Decoding does not verify the signature. | Use `jwt.verify()`. |
| Returning the whole user document | Sensitive fields can leak in API responses. | Select or construct a safe public user object. |
| Trusting `unique: true` as validation | Concurrent inserts can still produce a duplicate-key error. | Catch and handle the database error. |
| Returning different login errors | Attackers can discover registered email addresses. | Return one generic authentication error. |
| Committing `.env` | Secrets become available to anyone with repository access. | Ignore it and rotate any leaked credentials immediately. |

---

## 15. Summary

An authentication system is a chain of independent responsibilities:

1. Express receives and routes requests.
2. Input validation checks that data has the expected shape.
3. Mongoose stores users and controls which fields are selected.
4. bcrypt protects passwords with slow, salted hashes.
5. JWT signs a short identity claim for later requests.
6. Middleware verifies the token and loads the current user.
7. Authorization checks whether that authenticated user may perform an action.

The most important rule is simple: **the database must never contain a recoverable plain-text password**. From there, consistent input validation, careful token verification, safe responses, and layered security controls make the authentication flow reliable enough to extend.
