import { DefaultSession } from "next-auth";
import { SupportedLanguage } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      language: SupportedLanguage;
    } & DefaultSession["user"]
  }
} 