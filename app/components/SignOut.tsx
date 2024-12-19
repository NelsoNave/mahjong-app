"use client";
import React from "react";
import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleClick = () => {
    // sign out and redirect to the home page
    signOut({ callbackUrl: "/" });
  };

  return <button onClick={handleClick}>Sign out</button>;
};

export default SignOut;
