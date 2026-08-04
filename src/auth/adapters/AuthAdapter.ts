import type { AuthState } from "../core";

export interface AuthAdapter {
  initialize(): Promise<boolean>;

  login(): Promise<void>;

  logout(): Promise<void>;

  refreshToken(): Promise<boolean>;

  getState(): AuthState;
}
