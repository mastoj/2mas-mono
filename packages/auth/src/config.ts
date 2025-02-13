import { AuthConfig } from "./types";

export const accessCookieName = "access_token";
export const refreshCookieName = "refresh_token";
export const idCookieName = "id_token";

export const getEntraConfig = (): AuthConfig => {
  const tenantId = process.env.ENTRA_TENANT_ID!;
  const clientId = process.env.ENTRA_CLIENT_ID!;
  const scopes = [
    "https://graph.microsoft.com/mail.read",
    "openid",
    "profile",
    "offline_access",
  ];
  const useOIDC = process.env.ENTRA_USE_OIDC === "true";

  return {
    tenantId: tenantId,
    clientId: clientId,
    useOIDC: useOIDC,
    entraIdScope: process.env.ENTRA_OIDC_SCOPE,
    clientSecret: process.env.ENTRA_CLIENT_SECRET,
    redirectUri: `${process.env.APP_DOMAIN}/auth/login/callback`,
    url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    scopes,
  };
};
