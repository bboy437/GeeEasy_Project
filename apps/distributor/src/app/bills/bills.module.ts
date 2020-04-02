import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { BillsListComponent } from "./bills-list/bills-list.component";
import { BillsComponent } from "./bills.component";
import { BillsRoutingModule } from "./bills-routing.module";
import { BsDatepickerModule } from "ngx-bootstrap";
import { BillsDetailComponent } from "./bills-detail/bills-detail.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '@project/shared';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    BillsRoutingModule,
    BsDatepickerModule.forRoot(),
    LayoutsModule,
    SharedModule,
  ],
  declarations: [BillsComponent, BillsListComponent, BillsDetailComponent]
})
export class BillsModule {}
