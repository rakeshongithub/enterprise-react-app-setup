import { AuthManager, AuthService } from "../auth/";
import { KeycloakAdapter } from "../auth/adapters";

export async function bootstrap() {
  const manager = new AuthManager(new KeycloakAdapter());

  await manager.initialize();

  AuthService.initialize(manager);
}
