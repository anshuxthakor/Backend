buid command on render ?? -- npm install
start command on render ?? -- node server.js
envrinoment variable on render ?? -- PORT = 3000
## Backend Server Programming Notes

### 1. What is a server? How do you program a server?
A server is a computer or software that listens for requests from clients (like browsers or apps) and responds with data or services. To program a server, you use backend languages (like Node.js, Python, etc.) and frameworks (like Express for Node.js) to handle requests and send responses.

### 2. What is a port?
A port is a number that identifies a specific process or service on a computer. For example, web servers usually use port 80 (HTTP) or 443 (HTTPS).

### 3. What is localhost?
`localhost` refers to your own computer, using the IP address 127.0.0.1. It is used to access network services running on your own machine.

### 4. Difference between `npx nodemon server.js`, `nodemon server.js`, and `node server.js`
- `node server.js`: Runs your server once using Node.js.
- `nodemon server.js`: Runs your server and restarts it automatically when you change your code (if nodemon is installed globally).
- `npx nodemon server.js`: Runs nodemon without a global install, using the local version or downloading it temporarily.

### 5. What is HTTP?
HTTP (HyperText Transfer Protocol) is the protocol used for transferring web pages and data over the internet.

### 6. What is HTTPS?
HTTPS (HTTP Secure) is the secure version of HTTP. It encrypts data between the client and server using SSL/TLS.

### 7. What is `app.get`?
In Express.js, `app.get` defines a route handler for GET requests to a specific URL endpoint.

### 8. What are `req` and `res`?
- `req` (request): The object containing data sent by the client.
- `res` (response): The object used to send data back to the client.

### 9. What is `res.send`?
`res.send` is a method in Express.js to send a response (text, HTML, JSON, etc.) back to the client.

### 10. What are endpoints?
Endpoints are specific paths (URLs) on your server that handle requests, like `/users` or `/login`.

### 11. What is a `.gitignore` file?
A `.gitignore` file tells Git which files or folders to ignore (not track) in version control, such as `node_modules/` or `.env` files.

### 12. How to use a `.gitignore` file?
Create a `.gitignore` file in your project root and list the files/folders you want Git to ignore, one per line.

### 13. How to push your code to GitHub and deploy on Render.com
1. Initialize git: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Create a GitHub repo and push:
	- `git remote add origin <repo-url>`
	- `git push -u origin main`
5. On Render.com, connect your GitHub repo and follow the deployment steps.

### 14. Build command on Render
`npm install` (installs dependencies)

### 15. Start command on Render
`node server.js` (starts your server)

### 16. Environment variable on Render
Set `PORT=3000` in the Render dashboard to specify which port your app should use.
