import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  NbAuthStrategy,
  NbAuthResult,
  NbAuthStrategyClass,
} from "@nebular/auth";
import { Observable } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { of } from "rxjs";
import { environment } from "../../../environments/environment";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  token: string;
}

@Injectable()
export class CustomAuthStrategy extends NbAuthStrategy {
  private baseUrl = `${environment.apiUrl}/auth`;

  static setup(options: any): [NbAuthStrategyClass, any] {
    return [CustomAuthStrategy, options];
  }

  constructor(private http: HttpClient, private router: Router) {
    super();
  }

  authenticate(data?: any): Observable<NbAuthResult> {
    console.log("🔍 LOGIN - Raw data received:", JSON.stringify(data, null, 2));

    // Try different ways to extract the data
    let email,
      password,
      rememberMe = false;

    if (data?.email && data?.password) {
      // Direct object
      email = data.email;
      password = data.password;
      rememberMe = data.rememberMe || false;
    } else if (data?.user?.email && data?.user?.password) {
      // Wrapped in user object
      email = data.user.email;
      password = data.user.password;
      rememberMe = data.user.rememberMe || data.rememberMe || false;
    } else {
      // Try to find email/password in any nested structure
      const flatData = JSON.stringify(data);
      console.log("🔍 LOGIN - Could not find email/password in:", flatData);
    }

    console.log("🔍 LOGIN - Extracted credentials:", {
      email: email ? "***" : "missing",
      password: password ? "***" : "missing",
      rememberMe: rememberMe,
    });

    if (!email || !password) {
      return of(
        new NbAuthResult(false, null, "Email and password are required", [
          "Email and password are required",
        ])
      );
    }

    return this.http
      .post<any>(`${this.baseUrl}/sign-in`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          console.log("🔍 LOGIN RESPONSE:", response);
          if (response.access_token) {
            console.log("🔍 LOGIN - Token received, creating NbAuthResult");
            console.log("🔍 LOGIN - Remember Me:", rememberMe);

            // Store token with expiration based on Remember Me
            if (rememberMe) {
              // Remember Me: Store for 30 days
              const expirationDate = new Date();
              expirationDate.setDate(expirationDate.getDate() + 30);

              localStorage.setItem("auth_token", response.access_token);
              localStorage.setItem(
                "auth_token_expiry",
                expirationDate.toISOString()
              );
              localStorage.setItem("auth_remember_me", "true");

              console.log(
                "🔍 LOGIN - Token stored with 30-day expiration:",
                expirationDate.toISOString()
              );
            } else {
              // No Remember Me: Store for session only (or 1 day)
              const expirationDate = new Date();
              expirationDate.setDate(expirationDate.getDate() + 1); // 1 day

              localStorage.setItem("auth_token", response.access_token);
              localStorage.setItem(
                "auth_token_expiry",
                expirationDate.toISOString()
              );
              localStorage.setItem("auth_remember_me", "false");

              console.log(
                "🔍 LOGIN - Token stored with 1-day expiration:",
                expirationDate.toISOString()
              );
            }

            // Store user information if provided in response
            if (response.user) {
              console.log(
                "🔍 LOGIN - User info found in response:",
                response.user
              );

              // Normalize the user object to have consistent 'name' field
              const normalizedUser = {
                id: response.user.id,
                name:
                  response.user.fullName ||
                  response.user.name ||
                  response.user.username ||
                  response.user.email,
                email: response.user.email,
                picture:
                  response.user.picture ||
                  response.user.avatar ||
                  "assets/images/nick.png",
              };

              console.log("🔍 LOGIN - Normalized user info:", normalizedUser);
              localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
            } else {
              console.log(
                "🔍 LOGIN - No user info in response, trying to decode JWT"
              );
              // Try to decode JWT token to get user info
              try {
                const payload = JSON.parse(
                  atob(response.access_token.split(".")[1])
                );
                console.log("🔍 LOGIN - JWT payload:", payload);

                if (payload.name || payload.username || payload.email) {
                  const userInfo = {
                    id: payload.sub || payload.id,
                    name: payload.name || payload.username || payload.email,
                    email: payload.email,
                    picture:
                      payload.picture ||
                      payload.avatar ||
                      "assets/images/nick.png",
                  };
                  console.log(
                    "🔍 LOGIN - Extracted user info from JWT:",
                    userInfo
                  );
                  localStorage.setItem("auth_user", JSON.stringify(userInfo));
                }
              } catch (error) {
                console.error("🔍 LOGIN - Error decoding JWT:", error);
              }
            }

            // Return successful result (no automatic redirect)
            return new NbAuthResult(true, response, "Login successful");
          } else {
            console.log("🔍 LOGIN - No access_token in response");
            return new NbAuthResult(false, response, "Login failed", [
              "Invalid credentials",
            ]);
          }
        }),
        tap((result) => {
          console.log("🔍 LOGIN - NbAuthResult created:", result);
          console.log("🔍 LOGIN - Is success?", result.isSuccess());

          if (result.isSuccess()) {
            console.log("🔍 LOGIN SUCCESS - Starting manual redirect");

            // Use a small delay to ensure localStorage is set, then redirect
            setTimeout(() => {
              console.log("🔍 LOGIN - Navigating to /redirect");
              this.router.navigate(["/redirect"]);
            }, 100);
          }
        }),
        catchError((error) => {
          console.error("🔍 LOGIN ERROR:", error);
          const errorMessage = error.error?.message || "Login failed";
          return of(
            new NbAuthResult(false, error, errorMessage, [errorMessage])
          );
        })
      );
  }

  register(data?: any): Observable<NbAuthResult> {
    console.log("🔍 REGISTER - Data received from NbRegisterComponent:", data);

    // Handle both direct data and form-wrapped data
    const registerData = data?.user || data;
    const { fullName, email, password } = registerData;
    const userType = "admin"; // Default to admin as requested

    console.log("🔍 REGISTER - Extracted data:", {
      fullName: fullName ? "***" : "missing",
      email: email ? "***" : "missing",
      password: password ? "***" : "missing",
    });

    if (!fullName || !email || !password) {
      return of(
        new NbAuthResult(false, null, "All fields are required", [
          "Full name, email and password are required",
        ])
      );
    }

    return this.http
      .post<any>(`${this.baseUrl}/sign-up`, {
        fullName,
        email,
        password,
        userType,
      })
      .pipe(
        map((response) => {
          console.log("🔍 REGISTER RESPONSE:", response);
          if (response.access_token) {
            console.log("🔍 REGISTER - Token received, creating NbAuthResult");

            // Store user information if provided in response
            if (response.user) {
              console.log(
                "🔍 REGISTER - User info found in response:",
                response.user
              );

              // Normalize the user object to have consistent 'name' field
              const normalizedUser = {
                id: response.user.id,
                name:
                  response.user.fullName ||
                  response.user.name ||
                  response.user.username ||
                  response.user.email,
                email: response.user.email,
                picture:
                  response.user.picture ||
                  response.user.avatar ||
                  "assets/images/nick.png",
              };

              console.log(
                "🔍 REGISTER - Normalized user info:",
                normalizedUser
              );
              localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
              console.log("🔍 REGISTER - User info stored in localStorage");
            }

            // Store token information for debugging
            console.log(
              "🔍 REGISTER - About to create NbAuthResult with token"
            );
            console.log(
              "🔍 REGISTER - Current localStorage keys:",
              Object.keys(localStorage)
            );

            // Return successful result without redirect (we handle it manually)
            return new NbAuthResult(
              true,
              response,
              "Registration successful",
              []
            );
          } else {
            console.log("🔍 REGISTER - No access_token in response");
            return new NbAuthResult(false, response, "Registration failed", [
              "Registration failed",
            ]);
          }
        }),
        tap((result) => {
          console.log("🔍 REGISTER - NbAuthResult created:", result);
          console.log("🔍 REGISTER - Is success?", result.isSuccess());

          // Manual redirect for registration
          if (result.isSuccess()) {
            console.log("🔍 REGISTER SUCCESS - Handling redirect manually");
            setTimeout(() => {
              console.log(
                "🔍 REGISTER - Redirecting to /pages using window.location"
              );
              window.location.href = "/pages";
            }, 300);
          }
        }),
        catchError((error) => {
          console.error("🔍 REGISTER ERROR:", error);
          const errorMessage = error.error?.message || "Registration failed";
          return of(
            new NbAuthResult(false, error, errorMessage, [errorMessage])
          );
        })
      );
  }

  requestPassword(data?: any): Observable<NbAuthResult> {
    const { email } = data;

    return this.http
      .post<any>(`${this.baseUrl}/reset-password`, {
        email,
      })
      .pipe(
        map((response) => {
          return new NbAuthResult(
            true,
            response,
            "Reset password email sent",
            []
          );
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.message || "Failed to send reset email";
          return of(
            new NbAuthResult(false, error, errorMessage, [errorMessage])
          );
        })
      );
  }

  resetPassword(data?: any): Observable<NbAuthResult> {
    // This would typically handle a token-based password reset
    // You may need to implement this endpoint in your NestJS backend
    const { password, confirmPassword, token } = data;

    if (password !== confirmPassword) {
      return of(
        new NbAuthResult(false, null, "Passwords do not match", [
          "Passwords do not match",
        ])
      );
    }

    return this.http
      .post<any>(`${this.baseUrl}/reset-password-confirm`, {
        token,
        password,
      })
      .pipe(
        map((response) => {
          return new NbAuthResult(
            true,
            response,
            "Password reset successful",
            []
          );
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || "Password reset failed";
          return of(
            new NbAuthResult(false, error, errorMessage, [errorMessage])
          );
        })
      );
  }

  logout(): Observable<NbAuthResult> {
    console.log("🔍 LOGOUT - Starting logout process");
    console.log(
      "🔍 LOGOUT - Before clearing - localStorage keys:",
      Object.keys(localStorage)
    );

    // Let Nebular handle its own token cleanup, but also clear any manual tokens
    localStorage.clear(); // Clear everything to ensure clean state

    console.log(
      "🔍 LOGOUT - After clearing - localStorage keys:",
      Object.keys(localStorage)
    );
    console.log("🔍 LOGOUT - Cleared all localStorage including user info");

    return of(new NbAuthResult(true, null, "Logout successful", []));
  }

  refreshToken(): Observable<NbAuthResult> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      return of(
        new NbAuthResult(false, null, "No token found", ["No token found"])
      );
    }

    // If your backend supports token refresh, implement it here
    return of(new NbAuthResult(true, { token }, "Token refreshed", []));
  }
}
