

interface ActionState<T> {
  status: "error" | "success" | "loading" | "initial";
  message?: string;
  data?: T;
  items?: T[];
};

