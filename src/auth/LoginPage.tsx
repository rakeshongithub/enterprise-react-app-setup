import useAuth from "./core/useAuth";

export default function LoginPage() {
  const auth = useAuth();

  return (
    <div>
      <h1>Login</h1>

      <button onClick={() => auth.login()}>Login with Okta</button>
    </div>
  );
}
