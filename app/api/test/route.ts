import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // test database connection
    const userCount = await prisma.user.count();

    return NextResponse.json({
      message: "Database connection successful",
      userCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
}
