import { Field } from "@/firebase/types";

const basicValidation = (
  field: Field,
  value: string,
  regex?: RegExp,
  regexReason?: string
): string | false => {
  if (field.required && value.trim() === "") {
    return "This field is required.";
  }

  if (field.maxLength !== undefined && value.length > field.maxLength) {
    return `Must be at most ${field.maxLength} characters.`;
  }

  if (field.minLength !== undefined && value.length > field.minLength) {
    return `Must be at least ${field.maxLength} characters.`;
  }

  if (regex && !regex.test(value)) {
    return regexReason || "Invalid format.";
  }

  return false;
};

const validateNumber = (field: Field, value: string): string | false => {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return "Please enter a valid number.";
  }

  if (field.min !== undefined && num < field.min) {
    return `Number must be at least ${field.min}.`;
  }

  if (field.max !== undefined && num > field.max) {
    return `Number must be at most ${field.max}.`;
  }

  if (field?.flags?.isIntegerOnly && !Number.isInteger(num)) {
    return "Please enter a whole number.";
  }

  return false;
};
const validateUrl = (value: string): string | false => {
  try {
    new URL(value);
    return false;
  } catch {
    return "Please enter a valid URL (e.g. https://example.com)";
  }
};

const validateField = (field: Field, value: string): string | false => {
  switch (field.type) {
    case "text": {
      return basicValidation(field, value);
    }
    case "textarea": {
      return basicValidation(field, value);
    }
    case "number": {
      return basicValidation(field, value) || validateNumber(field, value);
    }
    case "email": {
      return basicValidation(
        field,
        value,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address."
      );
    }
    case "phone": {
      return basicValidation(
        field,
        value,
        /^\+?[1-9][0-9]{7,14}$/,
        "Please enter a valid phone number."
      );
    }
    case "url": {
      return (
        basicValidation(
          field,
          value,
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/,
          "Please enter a valid URL (e.g. https://example.com)"
        ) || validateUrl(value)
      );
    }
  }

  return false;
};

const ErrorMessage = ({ error }: { error: string | null }) => {
  return <span className="text-sm text-destructive">{error}</span>;
};

export { ErrorMessage, validateField };
