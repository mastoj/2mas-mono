export type Auth =
  | {
      isAuthenticated: true;
      accessToken: string;
      name: string;
      username: string;
      roles: string[];
    }
  | {
      isAuthenticated: false;
    };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
};

export type AuthConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  url: string;
  scopes: string[];
};
