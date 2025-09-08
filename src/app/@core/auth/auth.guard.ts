import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  console.log("AuthGuard: Checking authentication...");

  // Check our auth_token storage
  const authToken = localStorage.getItem("auth_token");
  const tokenExpiry = localStorage.getItem("auth_token_expiry");
  const rememberMe = localStorage.getItem("auth_remember_me") === "true";

  console.log("AuthGuard: Auth token exists?", !!authToken);
  console.log("AuthGuard: Token expiry:", tokenExpiry);
  console.log("AuthGuard: Remember me:", rememberMe);

  if (authToken && tokenExpiry) {
    const expiryDate = new Date(tokenExpiry);
    const now = new Date();

    if (now < expiryDate) {
      // Token is still valid
      console.log("AuthGuard: Auth token is valid, allowing access");
      return true;
    } else {
      // Token has expired
      console.log(
        "AuthGuard: Auth token has expired, clearing storage and redirecting to login"
      );
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_token_expiry");
      localStorage.removeItem("auth_remember_me");
      router.navigate(["/auth/login"]);
      return false;
    }
  }

  // No token found, redirect to login
  console.log("AuthGuard: No auth token found, redirecting to login");
  router.navigate(["/auth/login"]);
  return false;
};
