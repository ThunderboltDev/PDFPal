import { Skeleton } from "@/components/ui/skeleton";

export default function Test() {
  return (
    <div className="mt-20 flex flex-col gap-10">
      <div className="mx-8 flex flex-col gap-0">
        <Skeleton
          count={4}
          height={60}
          variant="default"
        />
      </div>
      <div className="mx-8 flex flex-col gap-0">
        <Skeleton
          count={4}
          height={60}
          variant="secondary"
        />
      </div>
      <div className="mx-8 flex flex-col gap-0">
        <Skeleton
          count={4}
          height={60}
          variant="muted"
        />
      </div>
    </div>
  );
}
