import { axiosInstance } from "../config/axiosInstance";

const getErrorMessage = (error) =>
  error.response?.data?.error || error.message || "Something went wrong";

// CREATE NOTE
export const createNoteApi = async (noteData) => {
  try {
    let response = await axiosInstance.post("/create", noteData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// READ ALL NOTES
export const getAllNotesApi = async () => {
  try {
    let response = await axiosInstance.get("/notes");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// UPDATE NOTE
export const updateNoteApi = async (noteId, updatedData) => {
  try {
    let response = await axiosInstance.put(`/update/${noteId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// DELETE NOTE
export const deleteNoteApi = async (noteId) => {
  try {
    let response = await axiosInstance.delete(`/delete/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};