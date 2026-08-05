import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthProvider missing.');
  }

  const { manager, state } = context;

  return {
    ...state,
    login: () => manager.login(),
    logout: () => manager.logout(),
    refreshToken: () => manager.refreshToken(),
  };
}
