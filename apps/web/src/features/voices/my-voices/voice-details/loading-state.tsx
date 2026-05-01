import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  return (
    <div className="p-8">
      <Skeleton className="mb-6 h-5 w-20" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
