import Keycloak from "keycloak-js";
import { type AuthAdapter } from "./AuthAdapter";
import { type AuthState } from "../core";

export default class KeycloakAdapter implements AuthAdapter {
  private readonly keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    });
  }

  async initialize(options?: {
    onAuthenticated?: () => void;

    onLogout?: () => void;

    onTokenExpired?: () => void;
  }) {
    this.keycloak.onAuthSuccess = () => {
      options?.onAuthenticated?.();
    };

    this.keycloak.onAuthLogout = () => {
      options?.onLogout?.();
    };

    this.keycloak.onTokenExpired = () => {
      options?.onTokenExpired?.();
    };

    return this.keycloak.init({
      onLoad: "check-sso",

      pkceMethod: "S256",

      checkLoginIframe: true,
    });
  }

  async login() {
    await this.keycloak.login();
  }

  async logout() {
    await this.keycloak.logout();
  }

  async refreshToken() {
    return this.keycloak.updateToken(30);
  }

  getState(): AuthState {
    return {
      authenticated: !!this.keycloak.authenticated,

      user: this.keycloak.authenticated
        ? {
            id: this.keycloak.subject ?? "",
            username: this.keycloak.tokenParsed?.preferred_username ?? "",
            email: this.keycloak.tokenParsed?.email,
            firstName: this.keycloak.tokenParsed?.given_name,
            lastName: this.keycloak.tokenParsed?.family_name,
            roles: this.keycloak.realmAccess?.roles ?? [],
          }
        : undefined,

      session: this.keycloak.authenticated
        ? {
            accessToken: this.keycloak.token ?? "",
            refreshToken: this.keycloak.refreshToken,
            idToken: this.keycloak.idToken,
            expiresAt: this.keycloak.tokenParsed?.exp ?? 0,
          }
        : undefined,
    };
  }
}
