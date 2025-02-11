"use client";
import { PropsWithChildren } from "react";
import { useAuth } from "./hooks";

export const SignedOut = ({ children }: PropsWithChildren) => {
  const authData = useAuth();
  console.log("==> SignedOut:", authData);
  if (!authData.isAuthenticated) {
    return children;
  }
  return null;
};
