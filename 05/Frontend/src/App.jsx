import React, { useEffect } from "react";
import NoteCard from "./components/NoteCard";
import { apiHook } from "./hooks/apiHook";
import Navbar from "./components/Navbar";

const App = () => {
  const { noteData, getAllNotes, updateNote, deleteNote } = apiHook();
  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[#EFECE5]">
      <Navbar />

      <div className="max-w-9xl mx-auto px-3 py-5">
        {noteData.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#8C8577] text-sm tracking-wide mb-2">
              Marlow
            </p>
            <h2 className="text-2xl text-[#21201C] mb-1">No notes yet</h2>
            <p className="text-[#6B6459] text-sm">
              Click "Add Note" to create your first one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {noteData.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;