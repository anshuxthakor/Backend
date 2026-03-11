
---

# MongoDB + Node.js Notes

## 1. Cluster

A **cluster** in MongoDB is the main environment where your databases run.

A cluster is basically a **combination of two core components**:

* **Storage** → where the data is stored
* **Processor (Compute)** → which handles queries, reads, writes, indexing, etc.

So conceptually:

```
Cluster = Storage + Processor
```

In cloud databases like MongoDB Atlas, MongoDB manages these resources for you automatically.

---

## 2. Database

A **database** is a structured collection of data.

It organizes data into **collections**, which contain **documents**.

Example hierarchy:

```
Cluster
   └── Database
        └── Collection
              └── Document
```

Example:

```
Cluster
   └── ecommerceDB
        └── users
        └── products
        └── orders
```

---

## 3. Cloud (MongoDB Atlas)

**MongoDB Atlas** is the **cloud platform for MongoDB**.

Instead of running MongoDB locally, Atlas allows you to run databases on the cloud.

Benefits:

* Managed infrastructure
* Automatic scaling
* Backups
* Security
* Monitoring

Official site:

```
https://www.mongodb.com/atlas
```

---

# 4. Types of Servers

In database environments, servers can be categorized as:

### Local Server

Runs on your own machine.

Example:

```
mongodb://localhost:27017
```

Used for development.

---

### Cloud Server

Hosted on the internet.

Example:

```
mongodb+srv://username:password@cluster.mongodb.net/
```

Used for:

* production
* deployment
* scalability

MongoDB Atlas provides these cloud servers.

---

# 5. Creating and Connecting a Cluster

## Step 1 — Create Account

Go to:

```
https://www.mongodb.com/atlas
```

Create an account.

---

## Step 2 — Create a Cluster

1. Click **Build a Cluster**
2. Choose **Free Tier (M0)**
3. Select a **cloud provider**
4. Select a **region**
5. Click **Create Cluster**

The cluster will take ~2 minutes to initialize.

---

## Step 3 — Create Database User

Inside **Database Access**

Create a user:

```
username: yourUser
password: yourPassword
```

Give **Read and Write** permissions.

---

## Step 4 — Allow Network Access

Inside **Network Access**

Add IP:

```
0.0.0.0/0
```

This allows access from anywhere.

---

## Step 5 — Get Connection String (SRV)

Click:

```
Connect → Drivers
```

You will get a string like:

```
mongodb+srv://username:password@cluster0.abcd.mongodb.net/
```

This is called the **SRV connection string**.

---

# 6. Connecting to MongoDB Compass

**MongoDB Compass** is a GUI tool to manage MongoDB visually.

Steps:

1. Open **MongoDB Compass**
2. Click **New Connection**
3. Paste your **SRV connection string**

Example:

```
mongodb+srv://username:password@cluster0.abcd.mongodb.net/
```

4. Click **Connect**

Now you can see:

* databases
* collections
* documents

---

# 7. Project Folder Structure

Typical backend structure:

```
project
│
├── config
│     └── db.js
│
├── models
│     └── User.js
│
├── routes
│
├── .env
├── app.js
└── package.json
```

Explanation:

| Folder/File | Purpose                |
| ----------- | ---------------------- |
| config      | Database configuration |
| models      | Database models        |
| routes      | API routes             |
| .env        | Environment variables  |
| app.js      | Main server file       |

---

# 8. `.env` File

The `.env` file stores **sensitive data** like database URLs and API keys.

Example:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.abcd.mongodb.net/myDB
```

Never push `.env` to GitHub.

Add this to `.gitignore`:

```
.env
```

---

# 9. Using `.env` in Node.js

Install dotenv:

```
npm install dotenv
```

In `app.js`:

```javascript
require("dotenv").config()
```

Now you can access variables:

```javascript
process.env.PORT
process.env.MONGO_URI
```

---

# 10. Database Configuration (`config/db.js`)

Example connection file:

```javascript
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB Connected")
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB
```

---

# 11. Models Folder

The **models folder** contains all database models.

A **model represents a collection** in MongoDB.

Example:

```
models/
     User.js
     Product.js
     Order.js
```

Each file defines the structure of documents.

---

# 12. Schema

A **schema defines the structure of a document**.

It defines:

* fields
* data types
* validation rules

Example concept:

```
User
 ├── name
 ├── email
 ├── password
 └── age
```

---

# 13. Creating a Schema

Example in `models/User.js`:

```javascript
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  age: {
    type: Number
  }
})

module.exports = mongoose.model("User", userSchema)
```

Explanation:

* `User` → model name
* `userSchema` → schema definition

---

# 14. What is a Collection?

A **collection** is a group of documents.

Think of it like a **table in SQL**.

Example:

```
Collection: users

Document 1
{
  name: "Anshu",
  email: "anshu@gmail.com"
}

Document 2
{
  name: "Rahul",
  email: "rahul@gmail.com"
}
```

If the model name is:

```
User
```

MongoDB automatically creates the collection:

```
users
```

---

# 15. Importing the Model

In `app.js`:

```javascript
const User = require("./models/User")
```

Now you can interact with the **users collection**.

---

# 16. CRUD Operations in `app.js`

CRUD means:

```
Create
Read
Update
Delete
```

---

## Create

```javascript
const user = new User({
  name: "Anshu",
  email: "anshu@gmail.com",
  age: 20
})

await user.save()
```

---

## Read

Get all users:

```javascript
const users = await User.find()
```

Get one user:

```javascript
const user = await User.findOne({ email: "anshu@gmail.com" })
```

---

## Update

```javascript
await User.updateOne(
  { email: "anshu@gmail.com" },
  { age: 21 }
)
```

---

## Delete

```javascript
await User.deleteOne({
  email: "anshu@gmail.com"
})
```

---

# 17. Using Model in `app.js`

Example full usage:

```javascript
require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const User = require("./models/User")

const app = express()

connectDB()

app.get("/", async (req, res) => {

  const users = await User.find()

  res.json(users)
})

app.listen(process.env.PORT, () => {
  console.log("Server running")
})
```

---

# Summary

MongoDB structure:

```
Cluster
   └── Database
        └── Collection
             └── Document
```

Development flow:

```
MongoDB Atlas
      ↓
Connection String
      ↓
.env
      ↓
config/db.js
      ↓
models (schema + model)
      ↓
app.js (CRUD operations)
```

---
