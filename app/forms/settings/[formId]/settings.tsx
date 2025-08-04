"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { Form } from "@/firebase/types";
import { fetchFormById } from "@/firebase/forms";
import ShareButton from "@/components/forms/share-button";
import CopyButton from "@/components/forms/copy-button";
import ViewButton from "@/components/forms/view-button";
import Skeleton from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function FormSettings() {
  const { formId } = useParams();

  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      const form = await fetchFormById(String(formId));
      setForm(form);
    };

    fetchForm();
  }, [formId]);

  return (
    <div className="mt-20 container-md">
      <div className="relative">
        <h2 className="text-left">Settings</h2>
        <div
          role="group"
          className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex flex-row space-x-2"
        >
          {form ? (
            <>
              <CopyButton formId={form.id} />
              <ViewButton formId={form.id} />
              <ShareButton form={form} />
            </>
          ) : (
            <Skeleton
              borderRadius={6}
              width={120}
              height={40}
            />
          )}
        </div>
      </div>
      <div className="mt-4">
        <DetailsRow
          label="Title"
          value={form?.title}
          skeletonWidth={100}
        />
        <DetailsRow
          label="Description"
          value={form?.description}
          skeletonWidth={100}
        />
        <DetailsRow
          label="Created At"
          value={form ? format(form.createdAt.toDate(), "PPP") : null}
        />
        <DetailsRow
          label="Last Updated At"
          value={form ? format(form.updatedAt.toDate(), "PPP") : null}
        />
      </div>
    </div>
  );
}

function DetailsRow({
  label,
  value,
  skeletonWidth,
}: {
  label: string;
  value: string | null | undefined;
  skeletonWidth?: number;
}) {
  return (
    <div className="flex">
      <span className="font-normal flex-shrink-0 pr-2">{label}:</span>{" "}
      <span
        className="flex-1 min-w-0 truncate"
        title={value ?? "Loading..."}
      >
        {value ?? <Skeleton width={skeletonWidth ?? 120} />}
      </span>
    </div>
  );
}
