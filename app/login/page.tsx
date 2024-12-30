"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "../components/Header";

export default function Login() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (!session) {
    return (
      <>
        <Header context="新規登録 / ログイン" />

        {/* Google auth */}
        <button
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
          onClick={() => signIn("google")}
        >
          Googleでログイン
        </button>

        {/* test login for development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-gray-600">開発用テストアカウント</p>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                signIn("credentials", {
                  email: "test1@example.com",
                  password: "password",
                  callbackUrl: "/",
                });
              }}
            >
              <input
                type="email"
                value="test1@example.com"
                readOnly
                className="rounded border p-2"
              />
              <button
                type="submit"
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                テストアカウントでログイン
              </button>
            </form>
          </div>
        )}
      </>
    );
  }

  redirect("/");
}
