import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PurchaseOrderDetailComponent } from "./purchase-order-detail/purchase-order-detail.component";
import { DecimalPipe } from "@angular/common";
import { OrderMessagesComponent } from "./purchase-order-detail/order-messages/order-messages.component";
import { NbChatModule } from "@nebular/theme";
import { PurchaseOrderSaveComponent } from "./purchase-order-save/purchase-order-save.component";
import { BsDatepickerModule, TypeaheadModule } from "ngx-bootstrap";
import { PurchaseOrderCreateComponent } from "./purchase-order-create/purchase-order-create.component";
import { PurchaseOrderListComponent } from "./purchase-order-list/purchase-order-list.component";
import { PurchaseComponent } from "./purchase-order.component";
import { PurchaseRoutingModule } from "./purchase-order-routing.module";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogsModule } from "../dialogs/dialogs.module";
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { PurchaseReorderComponent } from './purchase-reorder/purchase-reorder.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    NbChatModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    PurchaseRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    NgbModule,
    DialogsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    LayoutsModule,
    NgxSelectModule
  ],
  declarations: [
    PurchaseComponent,
    PurchaseOrderDetailComponent,
    OrderMessagesComponent,
    PurchaseOrderSaveComponent,
    PurchaseOrderCreateComponent,
    PurchaseOrderListComponent,
    PurchaseReorderComponent
  ],
  providers: [DecimalPipe]
})
export class PurchaseOrderModule {}
