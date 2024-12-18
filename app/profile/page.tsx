"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn() {
  const { data: session, status } = useSession();

  console.log("session", session);

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

  const user = session.user;
  return (
    <>
      <h1>Welcome {user?.name}</h1>
      <h2>{user?.image}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}
