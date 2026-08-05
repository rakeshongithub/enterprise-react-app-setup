import type { AuthState } from "../core";

export interface AuthAdapter {
  initialize(): Promise<boolean>;

  handleLoginRedirect(): Promise<void>;

  login(): Promise<void>;

  logout(): Promise<void>;

  refreshToken(): Promise<boolean>;

  getState(): AuthState;
}
