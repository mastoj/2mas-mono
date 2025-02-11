import { AuthConfig } from "./types";

export const accessCookieName = "access_token";
export const refreshCookieName = "refresh_token";
export const idCookieName = "id_token";

export const getEntraConfig = (): AuthConfig => {
  const tenantId = process.env.ENTRA_TENANT_ID!;
  const scopes = [
    "https://graph.microsoft.com/mail.read",
    "openid",
    "profile",
    "offline_access",
  ];
  return {
    tenantId: tenantId,
    clientId: process.env.ENTRA_CLIENT_ID!,
    redirectUri: `${process.env.APP_DOMAIN}/auth/login/callback`,
    clientSecret: process.env.ENTRA_CLIENT_SECRET!,
    url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    scopes,
  };
};
