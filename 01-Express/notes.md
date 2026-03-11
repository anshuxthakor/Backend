
# Express.js Project Guide

This document explains the basics of Node.js, Express.js, and the structure of your project. Each section covers a key concept or file, with detailed explanations and usage examples.

---

## 1. How to Run a Script with Node.js

Node.js allows you to run JavaScript files outside the browser. To run a script, use:

```
node <filename>
```

For example, to start your server:

```
node server.js
```

---

## 2. What are Packages?

Packages are reusable libraries or modules that add functionality to your project. Examples include `express` (for web servers) and `dotenv` (for environment variables).

---

## 3. How to Install Packages

Use npm (Node Package Manager) to install packages:

```
npm install <package-name>
```

Example:

```
npm install express
```

---

## 4. Project Structure and Key Files

- **package.json**: Contains project metadata, dependencies, and scripts. Created with `npm init`.
- **package-lock.json**: Records the exact versions of installed packages for consistency.
- **node_modules/**: Directory where npm installs packages. Do not edit manually.
- **src/**: Source folder for your application code. Contains `app.js`.
- **server.js**: Entry point of your application. Starts the Express server.
- **.env**: Stores environment variables (e.g., `PORT=3000`). Keeps sensitive data out of your code.

---

## 5. How to Create a Server with Express.js

1. **Install Express:**
	```
	npm install express
	```
2. **Create `src/app.js`:**
	```js
	const express = require('express');
	const app = express();
	module.exports = app;
	```
3. **Create `server.js`:**
	```js
	require('dotenv').config();
	const app = require('./src/app');
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
	  console.log(`Server is running at port ${PORT}`);
	});
	```

---

## 6. What is Express.js?

Express.js is a minimal and flexible Node.js web application framework. It provides tools to build web servers and APIs quickly and easily, handling routing, middleware, and more.

---

## 7. What is the dotenv Package?

`dotenv` loads environment variables from a `.env` file into `process.env`. This keeps sensitive configuration (like API keys or port numbers) out of your codebase and allows easy configuration changes.

**Example `.env` file:**
```
PORT=3000
```

**Usage in code:**
```js
require('dotenv').config();
const port = process.env.PORT;
```

---

## 8. How These Are Used Together

1. **Environment Variables:**
	- Store configuration in `.env` (e.g., `PORT=3000`).
	- Load them in your code with `dotenv`.
2. **Express App:**
	- Define your app in `src/app.js`.
	- Start the server in `server.js` using the port from environment variables.
3. **Project Management:**
	- Use `package.json` to manage dependencies and scripts.
	- Install packages with `npm install`.

---

## 9. Example Workflow

1. Clone/download the project.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with your configuration.
4. Start the server:
	```
	node server.js
	```
5. Your Express app will be running and ready to handle requests!