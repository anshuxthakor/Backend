# Express, Middleware & Protocols

---

## 1. Why Express, Now

Day 02 built a server with raw `http` — four lines that could only ever send back one plain string, to every URL, no matter what.

Express is that same idea, but with the tedious parts already solved: routing, parsing, status codes. It sits on top of Node, not instead of it.

```js
const express = require("express");

const app = express();
const PORT = 8888;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, From Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

`app.get(path, callback)` replaces the single catch-all callback from raw `http` — now different URLs can return different things.

## 2. `app.use(express.json())` — The Line That's Easy to Skip and Break Everything

This is middleware: a function that runs on **every** request, before it reaches any route.

`express.json()` specifically looks at the body of an incoming request and converts it from raw text into a usable JS object, attached to `req.body`.

Without this line, a `POST` request with a JSON body still arrives — but `req.body` comes back `undefined`. The data was sent; Express just never parsed it.

```js
app.post("/create", (req, res) => {
  console.log(req.body); // undefined without app.use(express.json())
  res.send("POST api is working");
});
```

## 3. Routes Are Just Named Endpoints

Every route is a combination of:
- **Method** — `GET`, `POST`, etc. (what kind of action)
- **Path** — `/products`, `/create` (which resource)
- **Callback** — what actually happens, using `req` and `res`

```js
app.get("/products", (req, res) => {
  res.send({ products: [...], total: 194, skip: 0, limit: 30 });
});
```

Mapped against something like `fakestoreapi.com`: the domain is the **base URL**, and everything after it — `/products`, `/users`, `/carts`, `/auth` — is an **endpoint**. Same server, different doors.

## 4. The Restaurant Analogy, One Layer Deeper

| Restaurant | System |
|---|---|
| Ambience, chairs, tables, lights | **Frontend** |
| Kitchen | **Backend** |
| Storage inside the kitchen | **Database** |
| Waiter | **API** |
| Menu → items | Routes → endpoints |

The waiter (API) never cooks (processes data) — it only carries the order (request) in and the dish (response) back out. The kitchen (backend) is the only place actual work happens.

## 5. Server, Restated

A server is a machine — CPU, sometimes GPU — that's on 24×7, reachable from anywhere. Requests come in, get processed, responses go back out. Nothing about that changes with Express; Express just makes writing the "get processed" part faster.

## 6. Protocols — The Full Set

| Protocol | Meaning | Shape |
|---|---|---|
| **HTTP** | HyperText Transfer Protocol | `(req, res)` |
| **HTTPS** | HTTP, secured | `(req, res)` |
| **FTP** | File Transfer Protocol | `(req, file, cb)` |
| **SMTP** | Simple Mail Transfer Protocol | `(from, to, subject)` |
| **WebSocket** | Two-way, always-open connection | `(socket, id)` |

HTTP and HTTPS are the same shape: a client asks, a server answers, connection closes. A protocol, at its core, is just **a set of rules** both sides agree to follow.

WebSocket breaks that pattern on purpose — instead of one request and one response, the connection stays open in both directions. That's what actually powers chats, voice calls, and video calls (WebRTC), not repeated HTTP requests.

## 7. Node.js, One More Time

MERN's shared language is JS. JS was originally built to run inside a browser only. Node took the browser's JS engine and extracted it — a **runtime environment** that lets JS run standalone, outside the browser, built by Ryan Dahl.

---

## Key Takeaways

- Express doesn't replace raw Node — it wraps the same request/response cycle in far less code.
- `app.use(express.json())` must come before your routes, or `req.body` on any POST/PUT request is silently `undefined`.
- A route = method + path + callback. The path is the endpoint; the domain in front of it is the base URL.
- Frontend : Backend : Database : API maps directly to Ambience : Kitchen : Storage : Waiter.
- Every protocol is a set of rules for who sends what and in what order — HTTP/HTTPS/FTP/SMTP are request-then-response; WebSocket is the exception, staying open both ways.
- Node.js is the runtime environment that lets JS escape the browser — the reason a MERN stack can use one language for both ends.