# Integration: Connecting Frontend to Backend

---

## 1. The Wall: CORS

Frontend running on `http://localhost:5173` (Vite's default), backend running on `http://localhost:8888`. Different port means different origin as far as the browser is concerned — and by default, the browser blocks a request from one origin to another unless the server explicitly says it's allowed.

That's CORS — Cross-Origin Resource Sharing. It isn't the backend rejecting the request; it's the browser refusing to even hand the response back to the frontend's JavaScript, unless the right header says it's safe to.

## 2. The Fix

```js
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
}));
```

One middleware, added in `app.js`, before the routes. `origin` is set to the exact frontend URL rather than left wide open — the backend is explicitly trusting requests from that one address, not from everywhere.

## 3. The Two Servers, Talking

| | Frontend | Backend |
|---|---|---|
| Runs on | `localhost:5173` | `localhost:8888` |
| Framework | React + Vite | Express |
| Talks via | `axiosInstance` (`baseURL: http://localhost:8888/api`) | `cors({ origin: "http://localhost:5173" })` |

The `baseURL` on the frontend and the `origin` on the backend are two ends of the same handshake — the frontend says "send requests here," the backend says "only accept them from there."

## 4. Tracing One Full Request — Delete a Note

Click **Delete** on a `NoteCard`, and here's everywhere that click actually goes:

1. `NoteCard` calls `deleteNote(note._id)` — a prop, from `apiHook`.
2. `apiHook.deleteNote` calls `deleteNoteApi(noteId)`.
3. `deleteNoteApi` fires `axiosInstance.delete(\`/delete/${noteId}\`)` → resolves to `http://localhost:8888/api/delete/:id`.
4. The browser checks CORS first — origin `5173` is on the allowed list, request goes through.
5. Express routes it to `deleteNoteController`, which calls `NotesModel.findByIdAndDelete(id)`.
6. Mongoose talks to MongoDB, gets back either the deleted document or `null`.
7. Controller responds — `200` with a success message, or `404` if nothing matched.
8. Back in `apiHook`, `setNoteData` filters the deleted note out of local state.
9. React re-renders — the card is just gone, no page refresh, no refetch.

Nine steps, and every one of them was built and understood separately across the last few days before being wired together today.

## 5. Errors, Traced the Same Way

Backend controller fails → responds `{ error: "..." }` with a `4xx`/`5xx` status → `getErrorMessage` on the frontend pulls `error.response.data.error` out of that → thrown as a clean `Error` → caught in `formHook` → `setError("root", { message })` → shown directly under the form.

One consistent error shape, defined once in the controllers on Day 06, is what makes this entire chain work without any custom handling per component.

## 6. What "Integration" Actually Meant, Concretely

Not new backend logic, and barely any new frontend logic — almost the entire day was:
- One CORS header, so the browser stops blocking the frontend.
- One `baseURL`, so every request knows where to go.
- Confirming the response shape on both ends actually matches — `res.data.data`, `res.data.error`, exactly as the controllers send them.

---

## Key Takeaways

- CORS is a browser-side restriction, not a backend rejection — `cors({ origin })` is the backend explicitly whitelisting who's allowed to receive its responses.
- Matching ports matter: Vite's `5173` and Express's `8888` are two different origins by default, and that mismatch is exactly what CORS exists to gate.
- A single `axiosInstance` with one `baseURL` is what lets every API function in `api.js` stay a one-liner.
- Tracing one action (delete a note) end to end — component → hook → API wrapper → axios → CORS check → router → controller → Mongoose → response → state update → re-render — is the fastest way to actually see the full stack as one system instead of two separate projects.
- Consistent response shapes (`{ success, message, data }` / `{ error }`) from Day 06 are what make frontend error handling almost trivial today — the shape was already decided before integration even started.