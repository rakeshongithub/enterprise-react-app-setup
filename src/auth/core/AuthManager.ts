import { type AuthAdapter } from "../adapters/AuthAdapter";
import { type AuthState } from "./types";

export default class AuthManager {
  private state: AuthState = {
    authenticated: false,
  };

  private readonly adapter: AuthAdapter;

  constructor(adapter: AuthAdapter) {
    this.adapter = adapter;
  }

  async initialize() {
    await this.adapter.initialize();

    this.state = this.adapter.getState();

    return this.state.authenticated;
  }

  async login() {
    await this.adapter.login();
    this.state = this.adapter.getState();
  }

  async logout() {
    await this.adapter.logout();
    this.state = {
      authenticated: false,
    };
  }

  async refreshToken() {
    const refreshed = await this.adapter.refreshToken();

    if (refreshed) {
      this.state = this.adapter.getState();
    }

    return refreshed;
  }

  getState() {
    return this.state;
  }
}
