import SkeletonBase, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Skeleton(props: SkeletonProps) {
  return (
    <SkeletonBase
      {...props}
      borderRadius={999}
      containerClassName="!contents !h-0 flex-1 animate-pulse"
    />
  );
}
