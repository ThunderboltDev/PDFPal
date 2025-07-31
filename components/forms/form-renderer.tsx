import { Button } from "@/components/ui/button";
import { LocalForm, Form, Field } from "@/firebase/types";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

type Answer = { fieldId: string; value: string | number | boolean | null };
type FormValues = Record<string, string | boolean>;

type Props = {
  form: Form | LocalForm;
  onSubmit: (answers: Answer[]) => void;
};

export function DynamicFormRenderer({ form, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: form.fields.reduce(
      (acc: Record<string, string | boolean>, form) => {
        acc[form.id] = form.type === "toggle" ? false : "";
        return acc;
      },
      {} as FormValues
    ),
  });

  const renderField = (field: Field) => {
    const common = {
      ...register(field.id, { required: field.required }),
      name: field.id,
      id: field.id,
    };

    const label = <label htmlFor={field.id}>{field.label}</label>;

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id}>
            {label}
            <input
              type={field.type}
              placeholder={field.placeholder}
              {...common}
            />
            {errors[field.id] && <span>This field is required</span>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.id}>
            {label}
            <textarea
              placeholder={field.placeholder}
              {...common}
            />
            {errors[field.id] && <span>This field is required</span>}
          </div>
        );
      case "select":
        return (
          <div key={field.id}>
            {label}
            <select {...common}>
              <option value="">Choose…</option>
              {field.options?.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                >
                  {o.label}
                </option>
              ))}
            </select>
            {errors[field.id] && <span>This field is required</span>}
          </div>
        );
      case "toggle":
        return (
          <div key={field.id}>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required }}
              render={({ field: ctrl }) => (
                <>
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={Boolean(ctrl.value)}
                    onChange={(e) => ctrl.onChange(e.target.checked)}
                  />
                  <label htmlFor={field.id}>{field.label}</label>
                </>
              )}
            />
            {errors[field.id] && <span>This field is required</span>}
          </div>
        );
      default:
        return null;
    }
  };

  const internalSubmit: SubmitHandler<FormValues> = (data) => {
    const answers: Answer[] = form.fields.map((f) => ({
      fieldId: f.id,
      value: data[f.id] ?? null,
    }));
    onSubmit(answers);
  };

  return (
    <form
      onSubmit={handleSubmit(internalSubmit)}
      className="space-y-4"
    >
      {form.fields.sort((a, b) => a.order - b.order).map(renderField)}
      <Button
        variant="accent"
        size="default"
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}
