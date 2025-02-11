"use client";
import Cookies from "js-cookie";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Auth } from "../types";
import { getAuthData } from "../utils";

export const AuthContext = createContext<Auth | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<Auth>({ isAuthenticated: false });
  useEffect(() => {
    const accessCookie = Cookies.get("access_token");
    const idCookie = Cookies.get("id_token");
    console.log("==> Cookies:", accessCookie, idCookie);
    if (accessCookie && idCookie) {
      const authData = getAuthData(accessCookie, idCookie);
      setAuth(authData);
    }
  }, []);
  return <AuthContext value={auth}>{children}</AuthContext>;
};
