import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  console.log(session);

  if (!session) {
    redirect("/login");
  } else {
    redirect("/stats");
  }
}
