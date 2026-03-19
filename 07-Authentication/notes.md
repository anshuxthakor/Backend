# 🔐 Authentication System (JWT + Cookies) – Node.js Notes

---

# 1. What is Authentication?

Authentication is the process of **verifying the identity of a user**.

In this project, authentication is done using:

```
Email + Password → Verified → JWT Token issued
```

---

# 2. What is Authorization?

Authorization determines **what the user is allowed to do**.

Example:

```
Authenticated user → can access profile
Admin user → can delete users
```

⚠️ In this project:

* Authorization is **not implemented yet**
* Only authentication is handled

---

# 3. Technologies Used

| Tool          | Purpose                    |
| ------------- | -------------------------- |
| Express       | Backend framework          |
| Mongoose      | MongoDB ORM                |
| JWT           | Token-based authentication |
| Crypto        | Password hashing (basic)   |
| Cookie-parser | Read cookies from request  |

---

# 4. Project Structure

```
src/
│
├── config/
│     └── db.js
│
├── controllers/
│     └── auth.controller.js
│
├── models/
│     └── user.model.js
│
├── routes/
│     └── auth.route.js
│
app.js
server.js
.env
```

---

# 5. User Model (Database Layer)

Defines how user data is stored.

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
})
```

### Key Points:

* `email` is unique → prevents duplicate users
* Password is stored in **hashed form**

---

# 6. Password Hashing (Crypto)

```javascript
crypto.createHash('sha256')
      .update(password)
      .digest('hex')
```

### What happens:

1. Input password → `"123456"`
2. Converted → long hashed string
3. Stored in DB

### Why:

* Prevent storing plain passwords

⚠️ Limitation:

* No salt → vulnerable
* Should use **bcrypt (future upgrade)**

---

# 7. JWT (JSON Web Token)

JWT is used to **identify users after login**.

### Token Creation:

```javascript
jwt.sign(payload, secret, { expiresIn: '1h' })
```

### Your Payload:

```javascript
{
  id: user._id,
  email: user.email
}
```

### Meaning:

* Token carries user identity
* Server trusts token instead of asking DB repeatedly

---

# 8. Cookies (Token Storage)

```javascript
res.cookie('token', token)
```

### What happens:

* Token stored in browser cookies
* Automatically sent in every request

---

# 9. Auth Controller (Core Logic)

---

## 🔹 Register Controller

### Flow:

1. Get user data from request
2. Check if user exists
3. Hash password
4. Save user
5. Generate token
6. Store token in cookie
7. Send response

### Code Logic:

```javascript
const isUserExist = await userModel.findOne({ email })
```

Checks duplicate users

---

```javascript
const user = await userModel.create({...})
```

Creates new user in DB

---

```javascript
const token = jwt.sign(...)
```

Generates authentication token

---

## 🔹 Login Controller

### Flow:

1. Find user by email
2. Hash input password
3. Compare with stored password
4. Generate token
5. Store in cookie

---

```javascript
if(user.password !== hashedPassword)
```

Manual password comparison

---

## 🔹 GetMe Controller

### Flow:

1. Read token from cookies
2. Verify token
3. Extract user ID
4. Fetch user from DB

---

```javascript
const token = req.cookies.token
```

Reads token

---

```javascript
jwt.verify(token, SECRET)
```

Verifies token validity

---

```javascript
userModel.findById(decoded.id)
```

Fetches current user

---

# 10. Routes

```javascript
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/getme
```

### Mapping:

| Route    | Function         |
| -------- | ---------------- |
| register | Create user      |
| login    | Authenticate     |
| getme    | Get current user |

---

# 11. App Configuration

```javascript
app.use(express.json())
app.use(cookieParser())
```

### Meaning:

* Parses JSON request body
* Enables reading cookies

---

```javascript
app.use('/api/auth', authRouter)
```

Mounts auth routes

---

# 12. Validation vs Verification vs Authentication vs Authorization

---

### ✅ Validation

Checks input correctness

Example:

```
Is email valid?
Is password empty?
```

---

### ✅ Authentication

Verifies identity

```
Login success → user authenticated
```

---

### ✅ Verification

Confirms authenticity

```
JWT verify → token valid or not
```

---

### ✅ Authorization

Checks permissions

```
User allowed to access resource?
```

---

# 13. Cookies vs Local Storage

---

## Cookies

* Stored in browser
* Sent automatically with request

```javascript
res.cookie('token', token)
```

### Pros:

* Automatic
* Can be HTTP-only (secure)

---

## Local Storage

```javascript
localStorage.setItem('token', token)
```

### Pros:

* Easy to use

### Cons:

* Exposed to JavaScript → unsafe

---

## Key Difference

| Feature   | Cookies | Local Storage |
| --------- | ------- | ------------- |
| Auto send | Yes     | No            |
| Security  | High    | Low           |
| Access    | Limited | Full JS       |

---

### ❌ Insecure Cookies

Better version:

```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
})
```

---

# 15. Ideal Production Flow (Future)

```
User → Login/Register
     → bcrypt hash
     → JWT (access + refresh)
     → Stored in HTTP-only cookies
     → Middleware verifies token
     → Role-based authorization
```

---

# 16. Mental Model

```
Login → Identity verified
      → Token generated
      → Token stored (cookie)
      → Request sent with token
      → Server verifies token
      → Access granted/denied
```

---

# 17. Summary

* Authentication = Who are you
* Authorization = What can you do
* JWT = Identity token
* Cookie = Storage medium
* Hashing = Password protection

---
