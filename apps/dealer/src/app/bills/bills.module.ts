import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-dealer";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { BillsComponent } from "./bills.component";
import { BillsRoutingModule } from "./bills-routing.module";
import { BsDatepickerModule } from "ngx-bootstrap";
import { LayoutsModule } from '../layouts/layouts.module';
import { OrdersBillsListComponent } from './orders-bills-list/orders-bills-list.component';
import { OrdersBillsDetailComponent } from './orders-bills-detail/orders-bills-detail.component';
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
  declarations: [
    BillsComponent,
    OrdersBillsListComponent ,
    OrdersBillsDetailComponent,
  ]
})
export class BillsModule {}
