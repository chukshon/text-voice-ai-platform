import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </div>
  );
};

export default LoadingState;
