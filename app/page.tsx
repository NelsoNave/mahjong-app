import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  console.log(session);

  if (!session) {
    redirect("/login");
  } else {
    redirect("/result");
  }
}
