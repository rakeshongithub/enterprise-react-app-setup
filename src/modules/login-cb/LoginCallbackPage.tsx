import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { AuthService } from "../../auth/core";

export default function LoginCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function completeLogin() {
      try {
        await AuthService.getManager().handleLoginRedirect();

        navigate("/", {
          replace: true,
        });
      } catch (error) {
        console.error(error);

        navigate("/login", {
          replace: true,
        });
      }
    }

    completeLogin();
  }, [navigate]);

  return <div>Signing you in...</div>;
}
