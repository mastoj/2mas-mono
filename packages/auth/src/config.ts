import { ClientAssertionCredential } from "@azure/identity";
import { getVercelOidcToken } from "@vercel/functions/oidc";
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
  const getSecret = async () => {
    if (!useOIDC) {
      return process.env.ENTRA_CLIENT_SECRET!;
    } else {
      const credentialsProvider = new ClientAssertionCredential(
        tenantId,
        clientId,
        getVercelOidcToken
      );
      const token = await credentialsProvider.getToken(
        process.env.ENTRA_OIDC_SCOPE!
      );
      return token.token;
    }
  };

  return {
    tenantId: tenantId,
    clientId: clientId,
    useOIDC: useOIDC,
    redirectUri: `${process.env.APP_DOMAIN}/auth/login/callback`,
    getClientSecret: getSecret,
    url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    scopes,
  };
};
