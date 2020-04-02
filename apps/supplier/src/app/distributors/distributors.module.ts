import { NgModule } from "@angular/core";
import { NebularModule } from "@project/nebular";
import { ThemeModule } from "@project/theme-supplier";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { DistributorsComponent } from "./distributors.component";
import { SuppliersRoutingModule } from "./distributors-routing.module";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { MyDistributorsModule } from "./my-distributors/my-distributors.module";
import { BrowseDistributorModule } from "./browse-distributors/browse-supplier.module";
import { SavedListsModule } from "./saved-lists/saved-lists.module";
import { DialogsModule } from "../dialogs/dialogs.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    SuppliersRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    MyDistributorsModule,
    BrowseDistributorModule,
    SavedListsModule,
    DialogsModule
  ],
  declarations: [DistributorsComponent,],
  providers: [DecimalPipe]
})
export class DistributorsModule {}
