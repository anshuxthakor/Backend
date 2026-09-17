import React from "react";
import { formHook } from "../hooks/formHook";
import { apiHook } from "../hooks/apiHook";

const Form = ({ onClose }) => {
  const { createNote } = apiHook();
  const { register, handleSubmit, errors, onCreateNote, isSubmitting } =
    formHook(createNote, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#F5F3EF] px-6 py-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="text-xs tracking-wide text-[#8C8577] mb-2">Marlow</p>
            <h1 className="text-3xl text-[#21201C] leading-tight">New note</h1>
            <p className="text-[#6B6459] text-sm mt-2">
              Add a quick note to keep track of things.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer bg-transparent border-0 text-[#8C8577] hover:text-[#21201C] text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onCreateNote)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-xs text-[#6B6459] mb-1">
              Title
            </label>
            <input
              {...register("title", { required: true })}
              id="title"
              name="title"
              type="text"
              className="w-full bg-transparent border-0 border-b-2 border-[#DAD5CB] py-2 text-[#21201C] placeholder:text-[#B5AE9F] focus:outline-none focus:border-[#2F4B3C] transition-colors"
              placeholder="Note title"
            />
            {errors.title && (
              <p className="text-xs text-red-700 mt-1">Title is required.</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs text-[#6B6459] mb-1">
              Description
            </label>
            <input
              {...register("description", { required: true })}
              id="description"
              name="description"
              type="text"
              className="w-full bg-transparent border-0 border-b-2 border-[#DAD5CB] py-2 text-[#21201C] placeholder:text-[#B5AE9F] focus:outline-none focus:border-[#2F4B3C] transition-colors"
              placeholder="What's this note about?"
            />
            {errors.description && (
              <p className="text-xs text-red-700 mt-1">
                Description is required.
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-xs text-red-700">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-emerald-900 text-[#F5F3EF] text-sm py-3 mt-1 active:scale-95 transition-all duration-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating…" : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;