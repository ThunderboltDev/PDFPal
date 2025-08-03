import { ChangeEvent } from "react";

import {
  fieldTypeToIcon,
  fieldTypeToLabel,
} from "@/components/forms/field-config";
import { Input } from "@/components/ui/input";
import { Field } from "@/firebase/types";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface InputRedererProps {
  field: Field;
  update: (index: number, field: Field) => void;
}

function DefaultInput({ field, update }: InputRedererProps) {
  return (
    <Input
      id={field.id}
      type="text"
      icon={fieldTypeToIcon[field.type]}
      iconTooltip={fieldTypeToLabel[field.type]}
      className="text-fg-500"
      value={field.placeholder || ""}
      placeholder={fieldTypeToLabel[field.type]}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        update(field.order, {
          ...field,
          placeholder: e?.target?.value ?? "",
        });
      }}
    />
  );
}

export default function RenderInput({ field, update }: InputRedererProps) {
  switch (field.type) {
    case "text": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "email": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "url": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "number": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "phone": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "date": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "time": {
      return (
        <DefaultInput
          field={field}
          update={update}
        />
      );
    }
    case "textarea": {
      return (
        <Textarea
          id={field.id}
          className="text-fg-500"
          value={field.placeholder || ""}
          placeholder={fieldTypeToLabel[field.type]}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            update(field.order, {
              ...field,
              placeholder: e?.target?.value ?? "",
            });
          }}
        />
      );
    }
    case "slider": {
      return (
        <Slider
          className="mt-2"
          defaultValue={[Number(field.placeholder) ?? 0]}
          min={Number(field?.settings?.min ?? 0)}
          max={Number(field?.settings?.max ?? 100)}
          step={Number(field?.settings?.step ?? 1)}
          onValueChange={(values) => {
            update(field.order, {
              ...field,
              placeholder: `${values[0]}`,
            });
          }}
        />
      );
    }
  }
}
