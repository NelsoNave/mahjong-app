import React from "react";

interface BoxProps {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}

const Box: React.FC<BoxProps> = ({ className, children, size = "md" }) => {
  const sizeClasses = {
    sm: {
      height: "h-1/4",
      width: "w-1/2",
    },
    md: {
      height: "h-1/3",
      width: "w-full",
    },
  };

  const { height, width } = sizeClasses[size];

  return (
    <div
      className={`${height} ${width} flex flex-col rounded-lg border bg-neutral-50 p-4 shadow-lg ${className}`}
    >
      <div>{children}</div>
    </div>
  );
};

export default Box;
