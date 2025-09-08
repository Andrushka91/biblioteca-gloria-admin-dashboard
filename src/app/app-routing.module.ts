import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { authGuard } from "./@core/auth/auth.guard";

export const routes: Routes = [
  {
    path: "pages",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "miscellaneous",
    loadChildren: () =>
      import("./pages/miscellaneous/miscellaneous.module").then(
        (m) => m.MiscellaneousModule
      ),
  },
  // Add a redirect route that doesn't require auth
  {
    path: "redirect",
    redirectTo: "pages",
    pathMatch: "full",
  },
  { path: "", redirectTo: "auth/login", pathMatch: "full" },
  {
    path: "**",
    loadChildren: () =>
      import("./pages/miscellaneous/miscellaneous.module").then(
        (m) => m.MiscellaneousModule
      ),
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
