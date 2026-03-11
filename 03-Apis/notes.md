
# What is API?
API stands for **Application Programming Interface**. It is a set of rules and protocols that allows different software applications to communicate with each other. APIs define the methods and data formats that applications use to request and exchange information.

# HTTP and HTTPS
**HTTP** (HyperText Transfer Protocol) is the protocol used for transferring data over the web. It is not secure, meaning data can be intercepted.
**HTTPS** (HTTP Secure) is the secure version of HTTP. It uses SSL/TLS to encrypt data, ensuring secure communication between client and server.

# What are REST APIs?
**REST** (Representational State Transfer) APIs are web services that follow REST architectural principles. They use standard HTTP methods (GET, POST, PUT, DELETE, etc.) to perform operations on resources, which are typically represented as URLs.

# All the Methods with Use Cases of REST APIs and Idempotency
- **GET**: Retrieve data from the server. *(Idempotent)*
- **POST**: Create new resources. *(Not idempotent)*
- **PUT**: Update/replace a resource. *(Idempotent)*
- **PATCH**: Partially update a resource. *(Not always idempotent)*
- **DELETE**: Remove a resource. *(Idempotent)*

*Idempotent* means that making the same request multiple times will have the same effect as making it once.

# All the Status Codes with Use Cases of REST APIs
- **200 OK**: Request succeeded.
- **201 Created**: Resource created (POST).
- **204 No Content**: Request succeeded, no content to return (DELETE).
- **400 Bad Request**: Client error, invalid request.
- **401 Unauthorized**: Authentication required.
- **403 Forbidden**: Client does not have access rights.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server encountered an error.

# What is res.status().json() and res.send() in Express.js?
- `res.status().json()`: Sets the HTTP status code and sends a JSON response.
- `res.send()`: Sends a response of any type (string, object, buffer, etc.).

# Difference Between res.status().json() and res.send()
- `res.status().json()` is specifically for sending JSON data and allows you to set the status code.
- `res.send()` is more general and can send different types of responses, but does not automatically set the Content-Type to application/json unless you pass an object.

# What is express.json()? And app.use(express.json())?
- `express.json()` is a middleware in Express.js that parses incoming requests with JSON payloads.
- `app.use(express.json())` tells your Express app to use this middleware for all incoming requests, so you can access JSON data in `req.body`.
