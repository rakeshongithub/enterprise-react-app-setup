export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

export interface AuthState {
  authenticated: boolean;
  user?: AuthUser;
  session?: AuthSession;
}

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  roles: string[];
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login(): void;
  logout(): void;
}
