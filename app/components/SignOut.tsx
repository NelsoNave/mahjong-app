"use client";

import React from "react";
import { signOut } from "next-auth/react";

interface SignOutProps {
  className?: string;
}

const SignOut: React.FC<SignOutProps> = ({ className = "" }) => {
  const handleClick = () => {
    try {
      signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Failed to sign out", err);
      alert("サインアウトに失敗しました");
    }
  };

  return (
    <button
      className={`ml-auto mt-6 flex items-center gap-1 rounded-lg border border-zinc-500 px-3 py-2 hover:border-amazon hover:font-bold hover:text-amazon hover:outline-offset-8 ${className}`}
      onClick={handleClick}
    >
      <p className="text-sm">サインアウト</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="16"
        height="16"
      >
        <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
      </svg>
    </button>
  );
};

export default SignOut;
