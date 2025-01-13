import React from "react";

interface BoxProps {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}

const Box: React.FC<BoxProps> = ({ className, children, size = "md" }) => {
  const sizeClasses = {
    sm: {
      width: "w-1/2",
    },
    md: {
      width: "w-full",
    },
  };

  const { width } = sizeClasses[size];

  return (
    <div
      className={`${width} flex flex-col rounded-lg border bg-neutral-50 p-4 shadow-lg ${className}`}
    >
      <div>{children}</div>
    </div>
  );
};

export default Box;
