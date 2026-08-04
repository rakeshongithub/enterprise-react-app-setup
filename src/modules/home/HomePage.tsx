import { useAuth } from "../../auth";

export default function HomePage() {
  const auth = useAuth();

  return (
    <div>
      <h2>Authenticated :{String(auth.authenticated)}</h2>

      <pre>{JSON.stringify(auth.user, null, 2)}</pre>

      <button onClick={() => auth.login()}>Login</button>

      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
}
