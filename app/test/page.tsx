import { Skeleton } from "@/components/ui/skeleton";

export default function Test() {
  return (
    <div className="flex flex-col gap-10 mt-18">
      <div className="flex flex-col gap-0 mx-8">
        <Skeleton
          variant="dark"
          height={60}
          count={4}
        />
      </div>
      <div className="flex flex-col gap-0 mx-8">
        <Skeleton
          variant="secondary"
          height={60}
          count={4}
        />
      </div>
      <div className="flex flex-col gap-0 mx-8">
        <Skeleton
          variant="muted"
          height={60}
          count={4}
        />
      </div>
    </div>
  );
}
