import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";
import { Router } from "@angular/router";
import { NbAuthService } from "@nebular/auth";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";

  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private authService: NbAuthService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    // Handle user menu clicks
    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu"),
        map(({ item: { title } }) => title),
        takeUntil(this.destroy$)
      )
      .subscribe((title) => {
        if (title === "Log out") {
          this.logout();
        }
        // Add more menu actions here if needed
      });

    // Initialize user as null
    this.user = null;
    console.log("🔍 HEADER - Initializing header component");

    // Check if user info is stored in localStorage first
    const storedUser = localStorage.getItem("auth_user");
    console.log("🔍 HEADER - Checking localStorage for auth_user:", storedUser);
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        console.log("🔍 HEADER - User loaded from localStorage:", this.user);
      } catch (error) {
        console.error("🔍 HEADER - Error parsing stored user:", error);
      }
    } else {
      console.log("🔍 HEADER - No user found in localStorage");
    }

    // Get the actual logged-in user from the authentication service
    this.authService.onTokenChange().subscribe((token) => {
      console.log("🔍 HEADER - Token change:", token);
      if (token && token.isValid()) {
        const payload = token.getPayload();
        console.log("🔍 HEADER - Token payload:", payload);

        // First try to get user from localStorage (set during login)
        const storedUser = localStorage.getItem("auth_user");
        console.log(
          "🔍 HEADER - Checking localStorage in token change:",
          storedUser
        );
        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser);
            console.log(
              "🔍 HEADER - User from localStorage in token change:",
              this.user
            );
            return;
          } catch (error) {
            console.error(
              "🔍 HEADER - Error parsing stored user in token change:",
              error
            );
          }
        }

        // Fallback: extract from token payload
        const userName =
          payload.name || payload.username || payload.email || payload.sub;
        console.log("🔍 HEADER - Extracted user name from token:", userName);

        if (userName) {
          this.user = {
            name: userName,
            picture:
              payload.picture || payload.avatar || "assets/images/nick.png",
          };
          console.log("🔍 HEADER - Set user from token:", this.user);
        } else {
          this.user = null;
          console.log("🔍 HEADER - No user name found, setting user to null");
        }
      } else {
        // Only clear user if there's no valid user in localStorage
        const storedUser = localStorage.getItem("auth_user");
        if (!storedUser && this.user) {
          this.user = null;
          console.log(
            "🔍 HEADER - No valid token and no localStorage user, setting user to null"
          );
        } else if (storedUser && !this.user) {
          // Restore user from localStorage if we don't have one set yet
          try {
            this.user = JSON.parse(storedUser);
            console.log(
              "🔍 HEADER - Restored user from localStorage due to invalid token:",
              this.user
            );
          } catch (error) {
            console.error(
              "🔍 HEADER - Error restoring user from localStorage:",
              error
            );
            this.user = null;
          }
        } else {
          console.log(
            "🔍 HEADER - No valid token, but keeping existing user from localStorage"
          );
        }
      }
    });

    // Also try to get user from authentication service directly
    this.authService.getToken().subscribe((token) => {
      console.log("Direct token get:", token);
      if (token && token.isValid()) {
        const payload = token.getPayload();
        console.log("Direct token payload:", payload);

        // First try to get user from localStorage (set during login)
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser);
            console.log("Direct user from localStorage:", this.user);
            return;
          } catch (error) {
            console.error("Direct: Error parsing stored user:", error);
          }
        }

        // Fallback: extract from token payload
        const userName =
          payload.name || payload.username || payload.email || payload.sub;
        console.log("Direct extracted user name:", userName);

        if (userName) {
          this.user = {
            name: userName,
            picture:
              payload.picture || payload.avatar || "assets/images/nick.png",
          };
          console.log("Direct set user from token:", this.user);
        } else {
          this.user = null;
        }
      } else {
        // Only clear user if there's no valid user in localStorage
        const storedUser = localStorage.getItem("auth_user");
        if (!storedUser && this.user) {
          this.user = null;
          console.log(
            "Direct: No valid token and no localStorage user, setting user to null"
          );
        } else if (storedUser && !this.user) {
          // Restore user from localStorage if we don't have one set yet
          try {
            this.user = JSON.parse(storedUser);
            console.log(
              "Direct: Restored user from localStorage due to invalid token:",
              this.user
            );
          } catch (error) {
            console.error(
              "Direct: Error restoring user from localStorage:",
              error
            );
            this.user = null;
          }
        } else {
          console.log(
            "Direct: No valid token, but keeping existing user from localStorage"
          );
        }
      }
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  logout() {
    this.authService.logout("custom").subscribe((result) => {
      if (result.isSuccess()) {
        // Clear any additional user data
        this.user = null;
        // Clear stored user info
        localStorage.removeItem("auth_user");
        // Redirect to login page
        this.router.navigate(["/auth"]);
      }
    });
  }
}
