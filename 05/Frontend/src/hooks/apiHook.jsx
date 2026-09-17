import { useContext } from "react";
import { MyStore } from "../context/MyContext";
import {
  getAllNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from "../api/api";

export const apiHook = () => {
  const { noteData, setNoteData } = useContext(MyStore);

  const getAllNotes = async () => {
    try {
      const res = await getAllNotesApi();
      setNoteData(res.data);
      return res;
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      throw error;
    }
  };

  const createNote = async (formData) => {
    const res = await createNoteApi(formData); // throws on failure now
    setNoteData((prev) => [...prev, res.data]);
    return res;
  };

  const updateNote = async (noteId, updatedData) => {
    const res = await updateNoteApi(noteId, updatedData);
    setNoteData((prev) =>
      prev.map((note) => (note._id === noteId ? res.data : note)),
    );
    return res;
  };

  const deleteNote = async (noteId) => {
    await deleteNoteApi(noteId);
    setNoteData((prev) => prev.filter((note) => note._id !== noteId));
  };

  return { noteData, getAllNotes, createNote, updateNote, deleteNote };
};