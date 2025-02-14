import {
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
  Configuration,
  CryptoProvider,
  LogLevel,
  PublicClientApplication,
} from "@azure/msal-node";
import { AuthConfig, Tokens } from "./types";

export const getPublicClientApplication = (authConfig: AuthConfig) => {
  const config: Configuration = {
    auth: {
      clientId: authConfig.clientId,
      authority: authConfig.authority,
    },
    system: {
      loggerOptions: {
        loggerCallback(
          loglevel: LogLevel,
          message: string,
          containsPii: boolean
        ) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: LogLevel.Verbose,
      },
    },
  };

  const pca = new PublicClientApplication(config);
  return pca;
};

export const getAuthCodeUrl = async (
  pca: PublicClientApplication,
  authConfig: AuthConfig
) => {
  const cryptoProvider = new CryptoProvider();
  // Generate PKCE Codes before starting the authorization flow
  const returnUrl = await cryptoProvider
    .generatePkceCodes()
    .then(async ({ verifier, challenge }) => {
      // create session object if does not exist
      // if (!req.session.pkceCodes) {
      //   req.session.pkceCodes = {
      //     challengeMethod: "S256",
      //   };
      // }

      // Set generated PKCE Codes as session vars
      // req.session.pkceCodes.verifier = verifier;
      // req.session.pkceCodes.challenge = challenge;

      const stateBase64 = Buffer.from(
        JSON.stringify({ returnUrl: process.env.APP_DOMAIN! })
      ).toString("base64");
      // Add PKCE code challenge and challenge method to authCodeUrl request objectgit st
      const authCodeUrlParameters: AuthorizationUrlRequest = {
        scopes: authConfig.scopes,
        redirectUri: `${process.env.APP_DOMAIN}/auth/login/callback`,
        //codeChallenge: req.session.pkceCodes.challenge, // PKCE Code Challenge
        codeChallengeMethod: "S256", // PKCE Code Challenge Method
        state: stateBase64,
      };

      // Get url to sign user in and consent to scopes needed for applicatio
      const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
      return response;
    });
  return returnUrl;
};

export const getTokens = async (
  pca: PublicClientApplication,
  authConfig: AuthConfig,
  code: string,
  state: string
  // clientInfo: string
): Promise<Tokens | null> => {
  const stateJson = JSON.parse(Buffer.from(state, "base64").toString());
  const tokenRequest: AuthorizationCodeRequest = {
    code: code,
    scopes: authConfig.scopes,
    redirectUri: `${process.env.APP_DOMAIN}/auth/login/callback`,
    // codeVerifier: req.session.pkceCodes.verifier, // PKCE Code Verifier
    // clientInfo: req.query.client_info as string,
  };

  const tokens = await pca.acquireTokenByCode(tokenRequest);
  if (tokens.accessToken) {
    return {
      accessToken: tokens.accessToken,
      refreshToken: "",
      idToken: tokens.idToken,
      expiresIn: tokens.extExpiresOn?.getTime() || 0,
    } satisfies Tokens;
  }
  return null;
  // .then(() => {
  //   res.sendStatus(200);
  // })
  // .catch((error) => {
  //   res.status(500).send(error.errorMessage);
  // });
};
