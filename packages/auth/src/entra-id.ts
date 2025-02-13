import { ClientAssertionCredential } from "@azure/identity";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { AuthConfig } from "./types";

export const getClientSecret = async ({
  tenantId,
  clientId,
  clientSecret,
  useOIDC,
  entraIdScope,
}: AuthConfig) => {
  if (!useOIDC) {
    return clientSecret!;
  } else {
    const credentialsProvider = new ClientAssertionCredential(
      tenantId,
      clientId,
      getVercelOidcToken
    );
    const token = await credentialsProvider.getToken(entraIdScope!);
    return token.token;
  }
};
