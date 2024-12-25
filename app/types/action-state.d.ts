type ActionState = {
  status: "error" | "success" | "loading" | "initial";
  message?: string;
  data?: Record<string, string | number | boolean | null | undefined>;
};

