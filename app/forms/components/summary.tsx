import {
  LocalForm,
  LocalFormResponse,
  Field,
  Form,
  FormResponse,
} from "@/firebase/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  form: LocalForm | Form;
  response: LocalFormResponse | FormResponse;
}

export default function FormResponseSummary({ form, response }: Props) {
  return (
    <div className="space-y-6 mt-6 container-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.description && (
            <p className="text-fg-200">{form.description}</p>
          )}
          <Separator />
          {form.fields
            .sort((a, b) => a.order - b.order)
            .map((field: Field) => {
              const answer = response.answers[field.id];
              const isMultiline =
                typeof answer === "string" && answer.includes("\n");

              return (
                <div
                  key={field.id}
                  className="space-y-1"
                >
                  <div className="font-normal">{field.label}</div>
                  {isMultiline ? (
                    <div className="whitespace-pre-wrap font-light text-fg-300 bg-bg-200 p-2 rounded">
                      {answer}
                    </div>
                  ) : (
                    <div className="font-light text-fg-300">
                      {answer?.toString() ?? "—"}
                    </div>
                  )}
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
