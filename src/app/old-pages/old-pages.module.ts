import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { OldPagesComponent } from "./old-pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { OldPagesRoutingModule } from "./old-pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";

@NgModule({
  imports: [
    OldPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [OldPagesComponent],
})
export class OldPagesModule {}
