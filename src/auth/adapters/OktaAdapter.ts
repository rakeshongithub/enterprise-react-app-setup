import { OktaAuth } from "@okta/okta-auth-js";

import { type AuthAdapter } from "./AuthAdapter";

import type { AuthState, AuthUser } from "../core/types";

export default class OktaAdapter implements AuthAdapter {
  private readonly okta: OktaAuth;

  constructor() {
    this.okta = new OktaAuth({
      issuer: import.meta.env.VITE_OKTA_ISSUER,
      clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
      redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
      scopes: import.meta.env.VITE_OKTA_SCOPES.split(" "),
      pkce: true,
    });
  }

  async initialize() {
    const authenticated = await this.okta.isAuthenticated();

    return authenticated;
  }

  async login() {
    await this.okta.signInWithRedirect();
  }

  async logout() {
    await this.okta.signOut({
      postLogoutRedirectUri: import.meta.env.VITE_OKTA_POST_LOGOUT_URI,
    });
  }

  async refreshToken() {
    try {
      await this.okta.tokenManager.renew("accessToken");

      return true;
    } catch {
      return false;
    }
  }

  getState(): AuthState {
    const accessToken = this.okta.tokenManager.getTokensSync().accessToken;

    const idToken = this.okta.tokenManager.getTokensSync().idToken;

    if (!accessToken || !idToken) {
      return {
        authenticated: false,
      };
    }

    const claims = idToken.claims;

    const user: AuthUser = {
      id: claims.sub,
      username: claims.preferred_username ?? claims.email,
      email: claims.email,
      firstName: claims.given_name,
      lastName: claims.family_name,
      roles: (claims.groups as string[]) ?? [],
    };

    return {
      authenticated: true,
      user,
      session: {
        accessToken: accessToken.accessToken,
        idToken: idToken.idToken,
        expiresAt: accessToken.expiresAt,
      },
    };
  }
}
