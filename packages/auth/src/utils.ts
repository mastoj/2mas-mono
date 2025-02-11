import { Auth } from "./types";

export const decodeJwtAccessToken = (accessToken: string) => {
  const base64Url = accessToken.split(".")[1];
  if (!base64Url) {
    return null;
  }
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export const getAuthData = (accessToken: string, idToken: string): Auth => {
  const accessJwt = decodeJwtAccessToken(accessToken);
  const idJwt = idToken ? decodeJwtAccessToken(idToken) : null;
  const name = accessJwt?.name || idJwt?.name || "Unknown";
  const username = accessJwt?.preferred_username || idJwt?.preferred_username;
  const roles = accessJwt?.roles || idJwt?.roles || [];
  return {
    accessToken: accessToken,
    isAuthenticated: true,
    name,
    username,
    roles,
  };
};
