import SkeletonBase, { SkeletonProps } from "react-loading-skeleton";

interface CustomSkeletonProps extends SkeletonProps {
  borderRadius?: string | number;
}

export default function Skeleton(props: CustomSkeletonProps) {
  return (
    <SkeletonBase
      {...props}
      borderRadius={props.borderRadius ?? 999}
      containerClassName="!contents !h-0 flex-1 !cursor-progress"
    />
  );
}
