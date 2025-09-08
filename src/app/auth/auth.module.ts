import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  NbAlertModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
} from "@nebular/theme";
import { NbAuthModule } from "@nebular/auth";

import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    NbAuthModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbIconModule,
    NbCardModule,
    NbLayoutModule,
    NbTabsetModule,
  ],
})
export class AuthModule {}
