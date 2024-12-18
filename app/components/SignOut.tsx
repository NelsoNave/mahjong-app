"use client";
import React from "react";
import { signOut } from "next-auth/react";

const SignOut = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signOut({ callbackUrl: "/" });
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
};

export default SignOut;
