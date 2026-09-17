import React, { useContext } from "react";
import { MyStore } from "../context/MyContext";
import Form from "./Form";

const Navbar = () => {
  const { showForm, setShowForm } = useContext(MyStore);
  return (
    <div className="bg-[#F5F3EF] border-b border-[#DAD5CB] flex justify-between items-center py-4 px-6">
      <div>
        <h1 className="text-2xl text-[#21201C] leading-tight">Marlow Notes.</h1>
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="cursor-pointer bg-emerald-900 text-[#F5F3EF] text-ls px-4 py-2 hover:bg-emerald-800 font-semibold active:scale-95 transition-all duration-150"
      >
        Add Note
      </button>
      {showForm && <Form onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Navbar;