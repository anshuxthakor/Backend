import React, { useState } from "react";

const NoteCard = ({ note, updateNote, deleteNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const handleUpdate = async () => {
    await updateNote(note._id, { title, description });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-[#F5F3EF] border border-[#DAD5CB] px-5 py-4 flex flex-col gap-4">
        <div>
          <label className="block text-xs text-[#6B6459] mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-0 border-b-2 border-[#DAD5CB] py-2 text-[#21201C] focus:outline-none focus:border-[#2F4B3C] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#6B6459] mb-1">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent border-0 border-b-2 border-[#DAD5CB] py-2 text-[#21201C] focus:outline-none focus:border-[#2F4B3C] transition-colors"
          />
        </div>
        <div className="flex gap-3 text-sm mt-1">
          <button
            onClick={handleUpdate}
            className="cursor-pointer bg-emerald-900 text-[#F5F3EF] px-4 py-2 active:scale-95 transition-all duration-100"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="cursor-pointer bg-transparent border border-[#DAD5CB] text-[#6B6459] px-4 py-2 hover:text-[#21201C] hover:border-[#21201C] active:scale-95 transition-all duration-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F3EF] border border-[#DAD5CB] px-5 py-4">
      <h1 className="text-xl text-[#21201C]">{note.title}</h1>
      <p className="text-sm text-[#6B6459] mt-1">{note.description}</p>
      <div className="flex gap-3 text-sm mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer bg-transparent border-0 p-0 text-[#21201C] hover:underline hover:text-emerald-900 underline-offset-2"
        >
          Edit
        </button>
        <button
          onClick={() => deleteNote(note._id)}
          className="cursor-pointer bg-transparent border-0 p-0 text-red-700 hover:underline underline-offset-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;