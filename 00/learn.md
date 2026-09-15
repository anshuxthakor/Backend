# Backend Fundamentals

---

## Part One:

### 1. What Is Backend, Actually?

The simplest working definition: **backend is the part of a system nobody sees, doing the actual work.**

Analogy: a light switch.

- You flip a switch (`ON`), the light turns on.
- You never think about the wiring, the circuit, the electricity actually reaching the bulb.
- That wiring, hidden behind the wall, is the backend of a house.

Applied to a house, the same idea shows up everywhere:

| Visible (Frontend) | Hidden (Backend) |
|---|---|
| Lights | Wires, DB (distribution board) |
| Paint | Chemical composition of the paint |
| Walls | Plaster / bricks underneath |
| A working switch | The circuit that actually powers it |

Same logic applies to software. What the user sees and clicks is the frontend. What processes the click, fetches the data, and decides what to send back is the backend.

### 2. The Client-Server Model

A **server** is not a mysterious entity. It is a machine — a computer with a CPU (and sometimes a GPU) — that stays on, stays connected, and waits for requests.

The basic loop:

1. A **client** (browser, app) sends a **request**.
2. The **server** receives it, processes it (the "working" step).
3. The server sends back a **response**.
4. The client displays that response.

**The Restaurant Analogy** — the mental model that made this click:

- **Kitchen = Backend / Server** — where the actual work (cooking) happens.
- **Waiter = API** — the only channel between the customer and the kitchen. The customer never walks into the kitchen directly.
- **Customer = Client / Frontend** — places an order, waits, receives a dish.
- **Order = Request**, **Dish = Response**

Trace of one interaction:
`Customer places order → Waiter carries it to Kitchen → Kitchen prepares it → Waiter delivers the dish → Customer receives it`

This maps directly onto:
`Frontend sends request → API carries it to Server → Server processes it → API sends back response → Frontend receives data`

A server, physically, is just a **machine with a CPU or GPU**, running 24/7, reachable over the internet.

### 3. The Cloud Isn't Magic — It's Just Someone Else's Building

"Cloud storage" is not floating anywhere. It is disk space on a physical machine, sitting in a physical building, that someone else owns and maintains.

Example: **Gmail gives 15GB of free cloud storage.** That 15GB exists on Google's actual hardware, in an actual data center.

**The Three Major Cloud Providers:**

1. **AWS** — Amazon Web Services
2. **GCS** — Google Cloud Storage
3. **Microsoft Azure**

These companies own massive **data centers** and rent out slices of computing power and storage to everyone else, instead of every company having to build and maintain its own physical servers.

**CPU vs GPU (Computing Power):**

| | Style | Rough throughput |
|---|---|---|
| **CPU** | Sequential, general-purpose, task-switching | ~1000 tasks in 1 second |
| **GPU** | Massively parallel, purpose-built | ~1M operations in 1 second |

### 4. How the Internet Physically Reaches You

The internet backbone connecting countries isn't wireless — it's **physical fiber-optic cable, laid along the ocean floor.**

```
Your phone
  → Tower / Signal
    → ISP (Jio / Airtel / VI / BSNL)
      → Domestic network hub (e.g. Mumbai)
        → Undersea fiber-optic cable
          → International data center (e.g. California)
```

Companies like **TATA Communications** own and maintain major stretches of this undersea cable infrastructure. The internet is, in a literal sense, a global network of physical wires under the ocean.

### 5. Web 1.0 → Web 2.0 → Web 3.0

| Era | Years | Core capability |
|---|---|---|
| **Web 1** | 1994 – 2007 | Read only |
| **Web 2** | 2007 – present | Read + Write (~99% of the internet today) |
| **Web 3** | 2021 – ongoing | Read + Write + **Own** |

Web 3's core idea is **decentralization** — moving away from a few centralized companies controlling data, toward ownership distributed across a network, via **tokenization**, chained together. This is where **blockchain** comes from: a chain of blocks, distributed rather than centralized.

### 6. Servers vs. Local Machines

A server and a laptop are, at the hardware level, not fundamentally different — both are machines with a CPU. The real difference is **centralization**: a server lives in a data center, always on, deliberately made reachable from anywhere on the internet.

**Why can't your laptop just be the server?**

> "No gate for accessing or exploring — getting out, or letting something in, to listen."

There's no open, stable, public-facing port for outside traffic to reach your machine through. This is exactly why **hosting** exists — a hosting provider gives your code a machine that *does* have that gate open, permanently and publicly.

### 7. Node.js — What It Actually Is

**Node.js is a JavaScript Runtime Environment.**

Browsers already have a JavaScript engine built in. Node.js takes that same kind of engine and makes it runnable **outside the browser**, standalone — which is what allows JavaScript, originally a browser-only language, to run on a server, read files, talk to a database, and handle network requests. (Node.js dates back to **2008**.)

---

## Part Two: The Code

### 1. Why Start Without Express

Almost every backend tutorial opens with Express, which hides the actual work happening underneath. Day 02 starts one level below that: the raw `http` module built into Node itself, zero external packages.

```js
let http = require('http');

let server = http.createServer((req, res) => {
  res.end("Hello Client, I am a Server");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

Four working lines. This is a complete, functioning HTTP server — the code version of everything in Part One.

### 2. Line-by-Line Breakdown

**`require('http')`** — `http` is a core Node module, ships built-in, no `npm install` needed. `require()` pulls it into the file so its tools (like `createServer`) become available.

**`http.createServer(callback)`** — creates a server object. The callback runs **once for every single incoming request**, always receiving two objects:
- **`req` (request)** — the URL hit, method, headers, any data sent.
- **`res` (response)** — the tool used to build and send something back.

**`res.end("Hello Client, I am a Server")`** — sends the response and **closes the connection**. Skip this and the client waits indefinitely, since nothing has technically been sent back yet.

**`server.listen(3000, callback)`** — starts listening on **port 3000**, the specific "door" this server answers through. The callback only fires once the server has actually and successfully started — it's a confirmation, not a guarantee stated in advance.

### 3. The Request-Response Cycle, In Practice

1. Run `node server.js` — the process stays alive, waiting.
2. Open `localhost:3000` in a browser.
3. The browser sends a request to port 3000.
4. The callback fires, `req` and `res` are populated for this specific request.
5. `res.end(...)` sends back the string.
6. The browser displays: **"Hello Client, I am a Server."**

Every request re-runs the callback from scratch — no memory between requests unless deliberately built in later.

### 4. `package.json`, Unpacked

```json
{
  "name": "01",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "type": "commonjs"
}
```

| Field | What it actually does |
|---|---|
| `name` | Identifies the project. |
| `version` | Tracks the project's version (semver: major.minor.patch). |
| `main` | Entry point file. |
| `scripts` | Named shortcuts runnable via `npm run <name>`. |
| `keywords` | Metadata for discoverability if published to npm. |
| `type` | Which module system this project uses. |

**`"type": "commonjs"` vs `"type": "module"`** — CommonJS uses `require()`/`module.exports` (what `server.js` uses). ES Modules uses `import`/`export`, the same syntax as frontend JS/React.

### 5. What This Server Can't Do Yet (On Purpose)

- **No routing** — every URL on port 3000 returns the same response right now.
- **No status codes set explicitly** — no 200/404/500 communication.
- **No JSON responses** — just a plain string.
- **No middleware** — no logging, no parsing, no reusable request-handling logic.

Express exists to make all four of the above dramatically less tedious to write by hand.

---

## Key Takeaways

- Backend = the hidden work behind whatever the user sees, same idea whether it's a house's wiring or a web app.
- A server is just a machine (CPU/GPU) that stays on and waits for requests — `http.createServer` is that idea written in four lines of code.
- Client → Request → Server → Response → Client is the entire loop, whether described as a restaurant order or traced through `req`/`res`.
- The cloud is physical hardware owned by AWS, GCS, or Azure. The internet's backbone runs through real undersea fiber-optic cable.
- Web 2 is read + write, where the internet lives today. Web 3 is trying to add "own" through decentralization.
- Local machines can't be public servers without an open gate — hosting solves exactly this, and `server.listen(3000, ...)` is that gate being opened locally, for now.
- Node.js is what lets JavaScript escape the browser and run as a backend language — `require('http')` is that capability in action.
- `res.end()` is non-negotiable — without it, nothing has actually been sent, and the client just hangs.