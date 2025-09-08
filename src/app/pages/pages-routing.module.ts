import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
// Import old-pages components
import { ECommerceComponent } from "../old-pages/e-commerce/e-commerce.component";
import { DashboardComponent } from "../old-pages/dashboard/dashboard.component";
// Import books component
import { BooksComponent } from "./books/books.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "home",
        component: HomePageComponent,
      },
      // Old pages components integrated directly
      {
        path: "e-commerce",
        component: ECommerceComponent,
      },
      {
        path: "iot-dashboard",
        component: DashboardComponent,
      },
      {
        path: "books",
        component: BooksComponent,
      },
      {
        path: "layout",
        loadChildren: () =>
          import("../old-pages/layout/layout.module").then(
            (m) => m.LayoutModule
          ),
      },
      {
        path: "forms",
        loadChildren: () =>
          import("../old-pages/forms/forms.module").then((m) => m.FormsModule),
      },
      {
        path: "ui-features",
        loadChildren: () =>
          import("../old-pages/ui-features/ui-features.module").then(
            (m) => m.UiFeaturesModule
          ),
      },
      {
        path: "modal-overlays",
        loadChildren: () =>
          import("../old-pages/modal-overlays/modal-overlays.module").then(
            (m) => m.ModalOverlaysModule
          ),
      },
      {
        path: "extra-components",
        loadChildren: () =>
          import("../old-pages/extra-components/extra-components.module").then(
            (m) => m.ExtraComponentsModule
          ),
      },
      {
        path: "maps",
        loadChildren: () =>
          import("../old-pages/maps/maps.module").then((m) => m.MapsModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("../old-pages/charts/charts.module").then(
            (m) => m.ChartsModule
          ),
      },
      {
        path: "editors",
        loadChildren: () =>
          import("../old-pages/editors/editors.module").then(
            (m) => m.EditorsModule
          ),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("../old-pages/tables/tables.module").then(
            (m) => m.TablesModule
          ),
      },
      {
        path: "miscellaneous",
        loadChildren: () =>
          import("./miscellaneous/miscellaneous.module").then(
            (m) => m.MiscellaneousModule
          ),
      },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
