import { NgModule } from "@angular/core";
import { NebularModule } from "@project/nebular";
import { ThemeModule } from "@project/theme-dealer";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { DistributorsComponent } from "./distributors.component";
import { DistributorsRoutingModule } from "./distributors-routing.module";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { BrowseDistributorModule } from "./browse-distributors/browse-supplier.module";
import { DialogsModule } from "../dialogs/dialogs.module";


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    DistributorsRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    BrowseDistributorModule,
    DialogsModule
  ],
  declarations: [DistributorsComponent,],
  providers: [DecimalPipe]
})
export class DistributorsModule {}
