import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";

export default async function Home() {
  const session = await auth();
  console.log(session);

  if (!session) {
    redirect("/login");
  }

  // Todo : Display the dashboard when the user is authorized
  return (
    <>
      <h1>This is your scores</h1>
      <h2>Welcome, {session.user?.name}</h2>
      <h2>{session.user?.image}</h2>
      <SignOut />
    </>
  );
}
