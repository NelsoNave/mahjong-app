"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  color: string;
  type: 3 | 4 | "free";
  children: React.ReactNode;
};

const SelectTypeBtn = ({ children, type, color}: Props) => {
  const bgClasses = {
    '4': 'bg-[url("/btnBg_4.webp")]',
    '3': 'bg-[url("/btnBg_3.webp")]',
    'free': 'bg-[url("/btnBg_free.webp")]'
  };
  
  const router = useRouter();

  const handleClick = (type: string | number) => {
    router.push(`/new-match-registration/${type}`);
  };
  
  return (
    <button className={`w-full flex-1 rounded-2xl bg-${color} ${bgClasses[type]} bg-[url('/btnBg_${type}.webp')] bg-cover bg-center py-14 text-4xl font-bold text-white`} onClick={() => handleClick(type)}>
      {children}
    </button>
  );
};

export default SelectTypeBtn;
