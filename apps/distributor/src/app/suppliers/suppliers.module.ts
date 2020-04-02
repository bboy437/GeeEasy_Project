import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { NbChatModule, NbSelectModule } from "@nebular/theme";
import { SuppliersComponent } from "./suppliers.component";
import { MySuppliersModule } from "./my-suppliers/my-suppliers.module";
import { SuppliersRoutingModule } from "./suppliers-routing.module";
import { SaveListModule } from "./save-list/save-list.module";
import { BrowseSupplerModule } from "./browse-supplier/browse-supplier.module";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { DialogsModule } from "../dialogs/dialogs.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    MySuppliersModule,
    SuppliersRoutingModule,
    SaveListModule,
    BrowseSupplerModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DialogsModule
  ],
  declarations: [SuppliersComponent],
  providers: [DecimalPipe]
})
export class SuppliersModule {}
