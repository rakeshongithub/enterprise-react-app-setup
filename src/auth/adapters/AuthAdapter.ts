import type { AuthState } from "../core";

export interface AuthAdapter {
  initialize(options?: {
    onAuthenticated?: () => void;
    onLogout?: () => void;
    onTokenExpired?: () => void;
  }): Promise<boolean>;

  login(): Promise<void>;

  logout(): Promise<void>;

  refreshToken(): Promise<boolean>;

  getState(): AuthState;
}
