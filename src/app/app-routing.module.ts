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
  { path: "", redirectTo: "auth/login", pathMatch: "full" },
  // Redirect any unknown route to auth/login to prevent infinite loading
  {
    path: "**",
    redirectTo: "auth/login",
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
