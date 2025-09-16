"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Test() {
  useEffect(() => {
    // toast("Hello", {
    //   description: "This is a description",
    // });
  });

  return (
    <div className="mt-28 mx-16 flex flex-col gap-12">
      <Progress value={66} />
      <div className="w-20 mt-28 h-full mx-auto flex flex-col gap-6">
        <Button
          variant="info"
          onClick={() =>
            toast.info("Login state restored!", { duration: 100000 })
          }
        >
          Info
        </Button>
        <Button
          variant="danger"
          onClick={() => toast.error("Unexpected error occured!")}
        >
          Danger
        </Button>
        <Button
          variant="warning"
          onClick={() => toast.warning("Something unexpected happened!")}
        >
          Warning
        </Button>

        <Button
          variant="success"
          onClick={() => toast.success("Successfully completed task!")}
        >
          Success
        </Button>
        <Button
          variant="default"
          onClick={() => toast.loading("Loading...")}
        >
          Loading
        </Button>
      </div>
    </div>
  );
}
