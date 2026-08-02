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
