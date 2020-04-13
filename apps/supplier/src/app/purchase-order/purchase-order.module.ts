import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-supplier";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PurchaseOrderDetailComponent } from "./purchase-order-detail/purchase-order-detail.component";
import { DecimalPipe } from "@angular/common";
import { OrderSummaryComponent } from "./purchase-order-detail/order-summary/order-summary.component";
import { OrderMessagesComponent } from "./purchase-order-detail/order-messages/order-messages.component";
import { NbChatModule } from "@nebular/theme";
import { BsDatepickerModule, TypeaheadModule } from "ngx-bootstrap";
import { PurchaseOrderListComponent } from "./purchase-order-list/purchase-order-list.component";
import { PurchaseComponent } from "./purchase-order.component";
import { PurchaseRoutingModule } from "./purchase-order-routing.module";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogsModule } from "../dialogs/dialogs.module";
import { LayoutsModule } from '../layouts/layouts.module';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    PurchaseRoutingModule,
    LayoutsModule,
    NbChatModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgbModule,
    DialogsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),

  ],
  declarations: [
    PurchaseComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDetailComponent,
    OrderSummaryComponent,
    OrderMessagesComponent,
  ],
  providers: [DecimalPipe]
})
export class PurchaseOrderModule {}
