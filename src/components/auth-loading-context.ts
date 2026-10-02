import { createContext } from "react";

export type AuthLoadingState = "checking" | "signing-out";

interface AuthLoadingContextValue {
  state: AuthLoadingState;
  setState: (state: AuthLoadingState) => void;
}

export const AuthLoadingContext = createContext<AuthLoadingContextValue>({
  state: "checking",
  setState: () => {},
});
