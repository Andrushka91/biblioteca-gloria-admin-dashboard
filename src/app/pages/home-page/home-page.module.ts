import { NgModule } from "@angular/core";
import { NbCardModule, NbButtonModule, NbIconModule } from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { HomePageComponent } from "./home-page.component";

@NgModule({
  imports: [ThemeModule, NbCardModule, NbButtonModule, NbIconModule],
  declarations: [HomePageComponent],
})
export class HomePageModule {}
