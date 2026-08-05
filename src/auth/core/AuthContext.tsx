import { createContext } from 'react';
import AuthManager from './AuthManager';
import type { AuthState } from './types';

export interface AuthContextValue {
  state: AuthState;
  manager: AuthManager;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
