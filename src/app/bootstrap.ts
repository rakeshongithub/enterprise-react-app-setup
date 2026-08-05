import { AuthManager, AuthService } from "../auth/";
import { OktaAdapter } from "../auth/adapters";

export async function bootstrap() {
  const manager = new AuthManager(new OktaAdapter());

  await manager.initialize();

  AuthService.initialize(manager);
}
