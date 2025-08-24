import { Field, LocalFormResponse } from "@/firebase/types";
import TimeInput from "../inputs/time";
import TextInput from "../inputs/text";
import EmailInput from "../inputs/email";
import URLInput from "../inputs/url";
import PhoneNumberInput from "../inputs/phone";
import NumberInput from "../inputs/number";
import SliderInput from "../inputs/slider";
import DateInput from "../inputs/date";
import TextareaInput from "../inputs/textarea";

export interface InputRendererProps {
  field: Field;
  response: LocalFormResponse;
  update: (fieldId: string, newValue: string | number | boolean | null) => void;
}

export interface InputRendererPropsWithErrorHandling
  extends InputRendererProps {
  error: string | null;
  setError: (error: string | null) => void;
}

export default function RenderField({
  field,
  response,
  update,
  error,
  setError,
}: InputRendererPropsWithErrorHandling) {
  switch (field.type) {
    case "text": {
      return (
        <TextInput
          field={field}
          response={response}
          update={update}
          error={error}
          setError={setError}
        />
      );
    }
    case "email": {
      return (
        <EmailInput
          field={field}
          response={response}
          update={update}
          error={error}
          setError={setError}
        />
      );
    }
    case "url": {
      return (
        <URLInput
          field={field}
          response={response}
          update={update}
          error={error}
          setError={setError}
        />
      );
    }
    case "number": {
      return (
        <NumberInput
          field={field}
          response={response}
          update={update}
          error={error}
          setError={setError}
        />
      );
    }
    case "phone": {
      return (
        <PhoneNumberInput
          field={field}
          response={response}
          update={update}
          error={error}
          setError={setError}
        />
      );
    }
    case "date": {
      return (
        <DateInput
          field={field}
          response={response}
          update={update}
        />
      );
    }
    case "time": {
      return (
        <TimeInput
          field={field}
          response={response}
          update={update}
        />
      );
    }
    case "textarea": {
      return (
        <TextareaInput
          field={field}
          response={response}
          update={update}
          error={error}
          setError={setError}
        />
      );
    }
    case "slider": {
      return (
        <SliderInput
          field={field}
          response={response}
          update={update}
        />
      );
    }
  }
}
