
---

# REST API Notes 

## Understanding REST APIs

REST (**Representational State Transfer**) is an architectural style for designing networked applications. It relies on **stateless client-server communication over HTTP** using standard methods and status codes.

RESTful APIs are designed around **resources**, which can be anything such as users, products, or documents.

---

# Key Concepts

## 1. Resources

Everything that can be accessed via a RESTful API is considered a **resource**.
Each resource has a **unique identifier (URI)**.

Examples:

```
/users
/products
/orders
```

---

## 2. Representations

Resources are transferred in different formats such as:

* JSON (most common)
* XML

Example JSON:

```json
{
  "id": 1,
  "name": "Anshu",
  "email": "anshu@email.com"
}
```

---

## 3. Stateless Communication

REST APIs are **stateless**, meaning:

* Each request from client to server contains **all required information**
* The server **does not store session data**

Example:

Every request must include authentication tokens if required.

---

# HTTP Methods

HTTP methods define **what action should be performed on a resource**.

| Method | Description                              | Idempotent |
| ------ | ---------------------------------------- | ---------- |
| GET    | Retrieve a resource or list of resources | Yes        |
| POST   | Create a new resource                    | No         |
| PUT    | Replace a resource completely            | Yes        |
| PATCH  | Partially update a resource              | Yes        |
| DELETE | Remove a resource                        | Yes        |

---

## GET

Used to **retrieve data**.

Example:

```
GET /users
```

Response:

```json
[
 { "id": 1, "name": "Anshu" }
]
```

---

## POST

Used to **create new resources**.

Example:

```
POST /users
```

Body:

```json
{
 "name": "Anshu",
 "email": "anshu@email.com"
}
```

---

## PUT

Used to **replace an existing resource completely**.

Example:

```
PUT /users/1
```

Body:

```json
{
 "name": "New Name",
 "email": "new@email.com"
}
```

---

## PATCH

Used to **partially update a resource**.

Example:

```
PATCH /users/1
```

Body:

```json
{
 "name": "Updated Name"
}
```

---

## DELETE

Used to **remove a resource**.

Example:

```
DELETE /users/1
```

---

# Important Notes on HTTP Methods

### Idempotence

An **idempotent method** produces the same result whether it is executed **once or multiple times**.

Idempotent methods:

```
GET
PUT
PATCH
DELETE
```

Not idempotent:

```
POST
```

---

### Safe Methods

Safe methods **do not modify server data**.

Safe methods:

```
GET
HEAD
OPTIONS
```

---

# HTTP Status Codes

Status codes are **three-digit numbers** sent by the server to indicate the result of a request.

## Status Code Categories

| Range | Meaning       |
| ----- | ------------- |
| 1xx   | Informational |
| 2xx   | Success       |
| 3xx   | Redirection   |
| 4xx   | Client Error  |
| 5xx   | Server Error  |

---

# Common HTTP Status Codes

| Code | Category     | Description           | Example Use                |
| ---- | ------------ | --------------------- | -------------------------- |
| 200  | Success      | Request successful    | Successful GET             |
| 201  | Success      | Resource created      | POST request               |
| 204  | Success      | No content returned   | DELETE success             |
| 301  | Redirection  | Moved permanently     | URL redirect               |
| 302  | Redirection  | Temporary redirect    | Temporary URL change       |
| 304  | Redirection  | Not modified          | Cached resource            |
| 400  | Client Error | Bad request           | Invalid data               |
| 401  | Client Error | Unauthorized          | Authentication needed      |
| 403  | Client Error | Forbidden             | Permission denied          |
| 404  | Client Error | Resource not found    | Invalid URL                |
| 405  | Client Error | Method not allowed    | POST on read-only endpoint |
| 409  | Client Error | Conflict              | Resource state conflict    |
| 422  | Client Error | Unprocessable entity  | Validation error           |
| 500  | Server Error | Internal server error | Backend failure            |
| 501  | Server Error | Not implemented       | Unsupported feature        |
| 503  | Server Error | Service unavailable   | Server overload            |

---

# RESTful API Design Best Practices

1. Use **nouns for resources**

```
/users
/products
/orders
```

Not:

```
/getUsers
/createProduct
```

---

2. Use **plural nouns**

```
/users
/products
```

---

3. Use HTTP methods properly

```
GET → read
POST → create
PUT → replace
PATCH → update
DELETE → remove
```

---

4. Use proper **status codes**

Example:

```
200 OK
201 Created
404 Not Found
500 Server Error
```

---

5. Keep APIs **consistent and predictable**

Follow standard naming patterns and response formats.

---

6. Design **stateless APIs**

The server should not store client session information.

---

# Interview Questions

## Q1: What is a REST API?

REST is an architectural style used for designing networked applications using **HTTP methods and stateless communication**. Resources are accessed via URIs using methods like:

```
GET
POST
PUT
PATCH
DELETE
```

---

## Q2: Common HTTP methods?

| Method | Meaning          |
| ------ | ---------------- |
| GET    | Retrieve data    |
| POST   | Create data      |
| PUT    | Replace resource |
| PATCH  | Partially update |
| DELETE | Remove resource  |

---

## Q3: Difference between PUT and PATCH

**PUT**

* Replaces the entire resource
* Requires full resource body

**PATCH**

* Partially updates a resource
* Requires only modified fields

---

## Q4: What are HTTP status codes?

HTTP status codes indicate the **result of a request** and help clients understand whether the request succeeded or failed.

---

## Q5: Examples of HTTP status codes

```
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## Q6: What is idempotency?

An operation that produces **the same result even if repeated multiple times**.

Idempotent methods:

```
GET
PUT
PATCH
DELETE
```

POST is generally **not idempotent**.

---

## Q7: What are safe methods?

Safe methods **do not modify server data**.

Safe methods:

```
GET
HEAD
OPTIONS
```

---

## Q8: Should APIs return error status codes?

Yes.

Examples:

```
400 → Invalid request
404 → Resource not found
500 → Server error
```

---

## Q9: Best practices for REST API design

* Use nouns for resources
* Use HTTP methods correctly
* Use proper status codes
* Keep APIs consistent
* Design stateless APIs

---

## Q10: How to handle errors in REST APIs?

1. Return correct **HTTP status codes**
2. Include **descriptive error messages**
3. Log errors on the **server side**

Example:

```json
{
  "error": "Invalid email address"
}
```

---

# Express.js API Endpoints (Your Notes)

## API Endpoints in This Project

### POST /notes

Purpose: **Add a new note**

How it works:

* Receives data from frontend in `req.body`
* Adds the note to `notes` array
* Returns updated notes

---

### GET /notes

Purpose: **Retrieve all notes**

Returns the `notes` array.

---

### DELETE /notes/:index

Purpose: **Delete a specific note**

Dynamic route parameter:

```
/notes/:index
```

Example:

```
/notes/2
```

Value available in:

```
req.params.index
```

---

### PATCH /notes/:index

Purpose: **Update a note**

* Receives new description in `req.body.description`
* Updates the note

---

# Static vs Dynamic Routes in Express

## Static Route

A route with a fixed path.

Example:

```javascript
app.get('/notes', handler)
```

Matches only:

```
/notes
```

---

## Dynamic Route

A route containing parameters.

Example:

```javascript
app.delete('/notes/:index', handler)
```

Example URL:

```
/notes/3
```

Access value:

```javascript
req.params.index
```

---

# Important Express.js Concepts

### req.body

Data sent from frontend (JSON/form data).

Example:

```javascript
req.body.title
```

---

### req.params

Values from dynamic routes.

Example:

```javascript
req.params.index
```

If URL is:

```
/notes/2
```

Then:

```
req.params.index = 2
```

---
