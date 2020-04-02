import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrdersComponent } from "./orders.component";
import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrdersDetailComponent } from "./orders-detail/orders-detail.component";
import { OrdersSaveComponent } from "./orders-save/orders-save.component";
import { OrdersCreateComponent } from "./orders-create/orders-create.component";
import { BsDatepickerModule, TypeaheadModule } from "ngx-bootstrap";
import { DecimalPipe } from "@angular/common";
import { OrderSummaryComponent } from "./orders-detail/order-summary/order-summary.component";
import { NbChatModule } from "@nebular/theme";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { LayoutsModule } from '../layouts/layouts.module';
import { FilterStatus } from '../pipe/filter-status';
import { FilterName } from '../pipe/filter-name';
import { FilterDate } from '../pipe/filter-date';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { NgxSelectModule } from 'ngx-select-ex';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    OrdersRoutingModule,
    NbChatModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    SharedModule,
    NgxMaskModule.forRoot(options),
    LayoutsModule,
    NgxSelectModule
  ],
  declarations: [
    OrdersComponent,
    OrdersListComponent,
    OrdersDetailComponent,
    OrdersSaveComponent,
    OrdersCreateComponent,
    OrderSummaryComponent,
    FilterName,
    FilterStatus,
    FilterDate
  ],
  providers: [DecimalPipe]
})
export class OrderModule {}
