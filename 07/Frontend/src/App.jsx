import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const App = () => {
  let { register, handleSubmit } = useForm();

  const submitHandler = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    for (let i = 0; i < data.images.length; i++) {
      formData.append("images", data.images[i]);
    }
    try {
      await axios.post("http://localhost:3000/api/upload", formData);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
    console.log(data);
  };

  return (
    <div>
      <form className="form-card" onSubmit={handleSubmit(submitHandler)}>
        <input
          className="inp"
          {...register("name", { required: "Name is required" })}
          type="text"
          placeholder="Enter your name"
        />
        <input
          className="inp"
          {...register("email", { required: "Email is required" })}
          type="text"
          placeholder="Enter your email"
        />
        <input
          className="inpfile"
          multiple
          {...register("images")}
          type="file"
          placeholder="Upload your file"
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
