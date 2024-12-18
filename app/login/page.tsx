"use client";

import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
export default function Login() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (!session) {
    return (
      <>
        <h1>Please log in</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn("google");
          }}
        >
          <button type="submit">Sign in with Google</button>
        </form>
      </>
    );
  }

  // Back to the home page
  redirect("/");
}
