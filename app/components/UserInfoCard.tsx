"use client";

import React from "react";
import { UserInfoCardProps } from "@/app/types/user";

const UserInfoCard = ({
  label,
  value,
  actionText,
  d,
  onClick,
}: UserInfoCardProps) => (
  <div className="border-b-0.5 flex h-24 items-center justify-between border-slate-400">
    <div className="flex flex-col gap-1 font-medium">
      <p className="text-sm">{label}</p>
      <p>{value}</p>
    </div>
    <div
      className="text-amazon flex items-center gap-1 text-sm"
      onClick={onClick}
    >
      <p>{actionText}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="16"
        height="16"
      >
        <path d={d} />
      </svg>
    </div>
  </div>
);

export default UserInfoCard;
