import { type AuthAdapter } from "../adapters/AuthAdapter";
import { type AuthState } from "./types";

type Listener = (state: AuthState) => void;

export default class AuthManager {
  private state: AuthState = {
    authenticated: false,
  };

  private refreshTimer?: number;
  private readonly listeners = new Set<Listener>();
  private readonly adapter: AuthAdapter;

  constructor(adapter: AuthAdapter) {
    this.adapter = adapter;
  }

  async initialize() {
    await this.adapter.initialize();

    this.state = this.adapter.getState();
    this.scheduleRefresh();
    this.notify();

    return this.state.authenticated;
  }

  async login() {
    await this.adapter.login();

    this.state = this.adapter.getState();

    this.scheduleRefresh();

    this.notify();
  }

  async logout() {
    await this.adapter.logout();

    this.state = {
      authenticated: false,
    };

    this.notify();
  }

  async refreshToken() {
    const refreshed = await this.adapter.refreshToken();

    if (refreshed) {
      this.state = this.adapter.getState();

      this.scheduleRefresh();
      this.notify();
    }

    return refreshed;
  }

  getState() {
    return this.state;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private scheduleRefresh() {
    const expiresAt = this.state.session?.expiresAt;

    if (!expiresAt) {
      return;
    }

    const refreshAt = expiresAt * 1000 - Date.now() - 60000;

    if (refreshAt <= 0) {
      return;
    }

    window.clearTimeout(this.refreshTimer);

    this.refreshTimer = window.setTimeout(() => {
      this.refreshToken();
    }, refreshAt);
  }
}
