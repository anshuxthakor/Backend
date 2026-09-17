import { createContext, useState } from "react";

export const MyStore = createContext();

export const ContextProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  const [noteData, setNoteData] = useState([]);
  const store = {
    noteData, setNoteData, showForm, setShowForm
  };
  return <MyStore.Provider value={store}>{children}</MyStore.Provider>
};
