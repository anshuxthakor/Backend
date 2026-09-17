import { useForm } from "react-hook-form";

export const formHook = (createNote, onSuccess) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onCreateNote = async (data) => {
    try {
      await createNote(data);
      reset();
      onSuccess?.();
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onCreateNote,
  };
};