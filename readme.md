# Backend

A progressive Node.js backend learning repository. Each numbered directory builds on the previous lessons, starting with a raw HTTP server and gradually introducing Express, databases, file uploads, cloud storage, frontend integration, and authentication.

## What is covered

| Lesson | Topics |
| --- | --- |
| `00` | Backend fundamentals, client-server architecture, Node.js, and raw HTTP |
| `01` | Express, middleware, routes, and protocols |
| `02` | REST APIs, CRUD, request data, and HTTP status codes |
| `03` | Environment variables, MongoDB, Mongoose, and project structure |
| `04` | A database-backed Notes CRUD API with controllers and routers |
| `05` | Connecting a React/Vite frontend to the backend with CORS |
| `06` | File uploads with Multer, disk storage, and memory storage |
| `07` | Sending files from React with `FormData` |
| `08` | ImageKit uploads, MongoDB media URLs, and service layers |
| `09` | JSON Web Tokens (JWT) and stateless authentication concepts |
| `10` | Password hashing with bcrypt, login, registration, and protected routes |

Most lessons include a `learn.md` file with explanations and examples. Lessons that contain runnable Node.js projects include their own `package.json` and dependencies.

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB for database lessons
- An ImageKit account for lesson `08`
- A REST client such as Postman or `curl`

## Running a lesson

Change into the lesson directory, install its dependencies, and start the development server:

```bash
cd 04
npm install
npm run dev
```

The available scripts and entry point can differ between lessons. Check the lesson's `package.json` before running it. Earlier lessons can also be started directly with:

```bash
node server.js
```

## Environment variables

Lessons that use external services expect environment variables in a local `.env` file. Never commit credentials or connection strings.

Common variables include:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/backend
JWT_SECRET_KEY=replace_with_a_long_random_secret
URL_ENDPOINT=your_imagekit_url_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

The exact variables depend on the lesson. Refer to its source and notes for the required configuration.

## Repository structure

```text
00/                  Backend and Node.js fundamentals
01/                  Express basics
02/                  REST and CRUD
03/                  MongoDB connection
04/                  Notes CRUD API
05/                  Backend + frontend integration
06/                  Multer file uploads
07/                  FormData file uploads
08/                  ImageKit media uploads
09/                  JWT concepts
10/                  Authentication with bcrypt and JWT
```

## Notes

- This repository is organized for learning, so each lesson is intentionally self-contained.
- `node_modules/`, build output, logs, environment files, and uploaded secrets are ignored by Git.
- The examples are educational starting points and should be hardened with validation, rate limiting, secure production configuration, and error handling before deployment.
