import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { HomePageModule } from "./home-page/home-page.module";
import { BooksModule } from "./books/books.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
// Import old-pages modules for direct components
import { ECommerceModule } from "../old-pages/e-commerce/e-commerce.module";
import { DashboardModule } from "../old-pages/dashboard/dashboard.module";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    HomePageModule,
    BooksModule,
    ECommerceModule,
    DashboardModule,
    MiscellaneousModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
