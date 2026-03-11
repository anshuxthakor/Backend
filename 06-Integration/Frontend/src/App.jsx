import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const App = () => {

  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);

  function fetchNotes() {
    axios.get("http://localhost:3000/notes").then((response) => {
      setNotes(response.data.notes);
    });
  };

  function createNote() {
    setFormData({ title: "", description: "" });
    setEditingId(null);
    setShowForm(true);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      axios
        .put(`http://localhost:3000/notes/${editingId}`, formData)
        .then(() => {
          fetchNotes();
          resetForm();
        });
    } else {
      axios
        .post("http://localhost:3000/notes", formData)
        .then(() => {
          fetchNotes();
          resetForm();
        });

    }
  };

  function deleteNote(id) {
    axios.delete(`http://localhost:3000/notes/${id}`).then(() => {
      fetchNotes();
    });
  }

  function editNote(note) {
    setFormData({
      title: note.title,
      description: note.description
    });
    setEditingId(note._id);
    setShowForm(true);
  };

  function resetForm() {
    setFormData({ title: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <div className="main">
        <h1>Notes App</h1>
        <button className="btn" onClick={createNote}>
          Create Note
        </button>
      </div>
      {showForm && (
        <div className="overlay">
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="formBtns">
              <button className="btn add">
                {editingId ? "Update Note" : "Add Note"}
              </button>
              <button
                type="button"
                className="btn cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="notes">
        {notes.map((note) => (
          <div className="note" key={note._id}>
            <div className="noteActions">
              <button
                className="iconBtn"
                onClick={() => editNote(note)}
              >
                <Pencil size={16} />
              </button>
              <button
                className="iconBtn delete"
                onClick={() => deleteNote(note._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h1>{note.title}</h1>
            <pre>{note.description}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;