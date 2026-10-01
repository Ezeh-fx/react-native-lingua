import { createContext } from "react";

export type AuthLoadingState = "checking" | "signing-out";

export const AuthLoadingContext = createContext<
  (state: AuthLoadingState) => void
>(() => {});
