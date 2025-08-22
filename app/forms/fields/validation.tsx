import { Field } from "@/firebase/types";

const basicValidation = (field: Field, value: string, regex?: RegExp) => {
  if (field.required && value.trim() === "") {
    return "This field is required.";
  }

  if (field.maxLength && value.length > field.maxLength) {
    return `Must be at most ${field.maxLength} characters.`;
  }

  if (field.minLength && value.length > field.minLength) {
    return `Must be at least ${field.maxLength} characters.`;
  }

  if (regex && !regex.test(value.trim())) {
    return true;
  }

  return null;
};

const ErrorMessage = ({ error }: { error: string | null }) => {
  return <span className="text-sm text-destructive">{error}</span>;
};

export { ErrorMessage, basicValidation };
