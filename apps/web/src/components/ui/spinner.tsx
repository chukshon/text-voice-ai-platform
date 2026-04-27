import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader, LoaderCircle } from "lucide-react";

type SpinnerContentProps = {
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  type?: "loader" | "loaderCircle";
};

function Spinner({ className, type = "loader", size = "medium", children }: SpinnerContentProps) {
  const loaderVariants = cva("animate-spin text-primary", {
    variants: {
      size: {
        small: "size-6",
        medium: "size-8",
        large: "size-12",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  });
  return (
    <span>
      {type === "loader" ? (
        <Loader className={cn(loaderVariants({ size }), className, "text-lemon-base")} />
      ) : (
        <LoaderCircle className={cn(loaderVariants({ size }), className, "text-lemon-base")} />
      )}
      {children}
    </span>
  );
}

export { Spinner };
