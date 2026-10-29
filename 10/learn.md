# Authentication System: Express.js + bcrypt + Mongoose

## 1. What is authentication?

Authentication answers one question: **"Who are you?"**

In a typical web app:

1. A user **registers** with an email and password.
2. The server **stores** the user (never the plain password).
3. The user **logs in** with the same credentials.
4. The server **verifies** them and gives back a **token**.
5. The user sends that token with every later request to prove their identity.

---

## 2. The tools and why we use them

| Tool | Role |
|------|------|
| **Express.js** | Web framework. Handles routes like `/register` and `/login`. |
| **Mongoose** | Connects Node.js to MongoDB. Defines the User schema/model. |
| **bcrypt** | Hashes passwords so they are never stored in plain text. |
| **jsonwebtoken (JWT)** | Creates a signed token the client sends after login. |
| **dotenv** | Keeps secrets (DB URL, JWT secret) out of the code. |

---

## 3. Why hash passwords?

If your database leaks and passwords are stored as plain text, every account is compromised.

A **hash** is a one-way scrambled version of the password:

```
"mypassword123"  ->  "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
```

- You **cannot** reverse a hash back into the password.
- To check a login, you hash the entered password and **compare** it with the stored hash.

### How bcrypt works

- **Salt**: random data added before hashing. Two users with the same password get different hashes.
- **Salt rounds (cost factor)**: how many times the hashing is repeated (`10` is a common default). Higher is slower and harder to brute-force.
- bcrypt is **intentionally slow**, which makes password-guessing attacks expensive.

```js
const hash = await bcrypt.hash("mypassword123", 10);   // hashing
const ok   = await bcrypt.compare("mypassword123", hash); // true / false
```

---

## 4. Project structure

```
auth-app/
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── middleware/
│   └── authMiddleware.js
├── .env
├── server.js
└── package.json
```

---

## 5. Setup

```bash
mkdir auth-app && cd auth-app
npm init -y
npm install express mongoose bcrypt jsonwebtoken dotenv
```

`.env`

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/authdb
JWT_SECRET=change_this_to_a_long_random_string
```

> Add `.env` to `.gitignore`. Never push secrets to GitHub.

---

## 6. The User model (Mongoose)

`models/User.js`

```js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// Runs automatically before every save: hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password unchanged
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Helper method to check a password at login
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

**Key ideas**

- `unique: true` stops two accounts with the same email.
- `pre("save")` is a Mongoose **hook**: hashing happens automatically, so you can't forget it.
- `isModified("password")` prevents re-hashing an already-hashed password when you update other fields.

---

## 7. Auth routes

`routes/auth.js`

```js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password }); // hashed by the hook

    res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token: createToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // Same message for both cases so attackers can't tell which was wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token: createToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PROTECTED ROUTE (example)
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
```

---

## 8. Protecting routes (middleware)

`middleware/authMiddleware.js`

```js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next(); // allow the request to continue
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
```

Middleware sits **between** the request and the route handler. If the token is bad, the request stops here.

---

## 9. Server entry point

`server.js`

```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json()); // parse JSON request bodies

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
```

---

## 10. Full flow

```
REGISTER
Client --{name, email, password}--> Express
                                    -> check email not already used
                                    -> Mongoose pre-save hook: bcrypt.hash(password)
                                    -> save user in MongoDB
                                    -> return JWT

LOGIN
Client --{email, password}--------> Express
                                    -> find user by email
                                    -> bcrypt.compare(password, storedHash)
                                    -> match? return JWT : 401

PROTECTED REQUEST
Client --Authorization: Bearer <token>--> middleware
                                    -> jwt.verify(token)
                                    -> load user, attach to req.user
                                    -> route handler runs
```

---

## 11. Testing with curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'

# Protected route (paste the token from login)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

In MongoDB you'll see the stored password looks like `$2b$10$...` and not `secret123`.

---

## 12. Security checklist

- Never store plain-text passwords. Always hash with bcrypt.
- Keep `JWT_SECRET` long, random, and in `.env`.
- Use the **same error message** for wrong email and wrong password.
- Never return the password hash in API responses (use `.select("-password")`).
- Use **HTTPS** in production.
- Add **rate limiting** on `/login` (e.g. `express-rate-limit`) to slow brute-force attacks.
- Validate input (e.g. `express-validator` or `zod`): email format, password length.
- Set a sensible token expiry (`expiresIn`).
- Add `helmet` and `cors` with a restricted origin.
- For stronger setups, store the token in an **httpOnly cookie** instead of localStorage to reduce XSS risk.

---

## 13. Common mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting `app.use(express.json())` | `req.body` will be `undefined` |
| Hashing the password twice | Use `isModified("password")` in the hook |
| Using `bcrypt.compare` without `await` | It returns a Promise, so it is always truthy |
| Comparing passwords with `===` | Always use `bcrypt.compare` |
| Pushing `.env` to GitHub | Add it to `.gitignore` |

---

## 14. Summary

- **Express** handles the routes.
- **Mongoose** defines the User model and talks to MongoDB.
- **bcrypt** hashes passwords on register and verifies them on login.
- **JWT** proves the user's identity on later requests.
- **Middleware** protects private routes.