import AuthManager from "./AuthManager";

class AuthService {
  private manager?: AuthManager;

  initialize(manager: AuthManager) {
    this.manager = manager;
  }

  getManager() {
    if (!this.manager) {
      throw new Error("AuthManager not initialized.");
    }

    return this.manager;
  }
}

export default new AuthService();
