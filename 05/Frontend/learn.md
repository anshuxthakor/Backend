# The Frontend Side: React + Context + Hooks

---

## 1. One Axios Instance, Not a URL Repeated Everywhere

```js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8888/api",
});
```

Every API call now just does `axiosInstance.post("/create", ...)` instead of typing the full backend URL out each time. Change the backend's address once, in one file, and every request updates with it.

## 2. `api.js` — A Thin Wrapper Around Every Endpoint

```js
export const createNoteApi = async (noteData) => {
  try {
    let response = await axiosInstance.post("/create", noteData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
```

Each function does one job: call the right route, and turn a failed request into a clean `Error` with a readable message, pulled from whatever the backend actually sent back:

```js
const getErrorMessage = (error) =>
  error.response?.data?.error || error.message || "Something went wrong";
```

`error.response?.data?.error` is the backend's own `{ error: "..." }` shape from Day 06's controllers — this is what carries that message all the way to the UI.

## 3. Context — One Place for Shared State

```js
export const MyStore = createContext();

export const ContextProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  const [noteData, setNoteData] = useState([]);
  const store = { noteData, setNoteData, showForm, setShowForm };
  return <MyStore.Provider value={store}>{children}</MyStore.Provider>;
};
```

`noteData` (the actual notes) and `showForm` (whether the modal is open) both need to be read and updated from components that aren't directly related to each other — Navbar opens the form, App renders the notes, NoteCard deletes one. Context means none of that has to be passed down manually through props.

## 4. `apiHook` — Where API Calls and State Meet

```js
export const apiHook = () => {
  const { noteData, setNoteData } = useContext(MyStore);

  const createNote = async (formData) => {
    const res = await createNoteApi(formData);
    setNoteData((prev) => [...prev, res.data]);
    return res;
  };
  // ...
};
```

Components never call `createNoteApi` directly. They call `createNote` from this hook, which does the API call **and** updates `noteData` right after — so a create, update, or delete updates the UI immediately, without re-fetching the entire list from the server every time.

## 5. `formHook` — `react-hook-form`, Wired to the API

```js
const onCreateNote = async (data) => {
  try {
    await createNote(data);
    reset();
    onSuccess?.();
  } catch (error) {
    setError("root", { message: error.message });
  }
};
```

`register("title", { required: true })` handles field-level validation before submission even happens. If the API call itself fails, `setError("root", ...)` attaches the error to the form as a whole rather than to any one field, which is exactly the message `getErrorMessage` produced.

## 6. Components, Kept Deliberately Dumb

- **Navbar** — just a button that flips `showForm` to `true`, and renders `Form` conditionally.
- **Form** — a modal using `formHook`, has no idea how the API works underneath.
- **NoteCard** — toggles its own local `isEditing` state, calls `updateNote`/`deleteNote` from props, nothing more.

None of the components talk to `axios` directly. Every one of them goes through a hook.

## 7. Loading the Initial Data

```js
useEffect(() => {
  getAllNotes();
}, []);
```

One `useEffect`, empty dependency array, runs once when `App` mounts — the first and only full fetch. Every change after that (create, update, delete) updates `noteData` locally through the hook instead of hitting `/notes` again.

---

## Key Takeaways

- `axios.create({ baseURL })` centralizes the backend's address so it's set once, not repeated per call.
- `api.js` wraps every request in `try/catch`, converting a raw axios error into a clean message pulled from the backend's own `{ error }` response.
- Context (`MyStore`) holds state that multiple, unrelated components need — notes list and modal visibility — without prop drilling.
- `apiHook` is the bridge: every API call updates local state right after, so the UI doesn't need to refetch everything on each change.
- `react-hook-form`'s `setError("root", ...)` is for API-level failures; `register(..., { required: true })` handles field-level validation before the request is even sent.
- Components stay dumb on purpose — they call hooks, they don't know axios exists.