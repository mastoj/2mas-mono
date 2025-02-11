"use client";
import { PropsWithChildren } from "react";
import { useAuth } from "./hooks";

export const SignedIn = ({ children }: PropsWithChildren) => {
  const authData = useAuth();
  if (authData.isAuthenticated) {
    return children;
  }
  return null;
};
