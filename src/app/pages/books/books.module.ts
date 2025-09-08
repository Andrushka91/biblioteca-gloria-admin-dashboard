import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbButtonModule,
  NbSelectModule,
  NbDialogModule,
  NbToastrModule,
  NbSpinnerModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";

import { ThemeModule } from "../../@theme/theme.module";
import { BooksComponent } from "./books.component";
import { AddBookModalComponent } from "./add-book-modal/add-book-modal.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    NbButtonModule,
    NbSelectModule,
    NbDialogModule,
    NbToastrModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
    ThemeModule,
  ],
  declarations: [BooksComponent, AddBookModalComponent],
})
export class BooksModule {}
