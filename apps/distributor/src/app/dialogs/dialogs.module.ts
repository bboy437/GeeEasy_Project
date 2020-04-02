import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';
import { NbDialogModule, } from '@nebular/theme';
import { DialogSuccessComponent } from './dialog-success/dialog-success.component';
import { DialogsSavedListComponent } from './dialogs-saved-list/dialogs-saved-list.component';
import { DialogsSupplierRequestComponent } from './dialogs-supplier-request/dialogs-supplier-request.component';
import { DialogsSupplierWishlistComponent } from './dialogs-supplier-wishlist/dialogs-supplier-wishlist.component';
import { DialogsProductGroupComponent } from './dialogs-product-group/dialogs-product-group.component';
import { DialogsMapComponent } from './dialogs-map/dialogs-map.component';
import { AgmCoreModule } from '@agm/core';
import { DialogsImageComponent } from './dialogs-image/dialogs-image.component';
import { DialogsConfirmPoComponent } from './dialogs-confirm-po/dialogs-confirm-po.component';
import { DialogsCheckinStatusComponent } from './dialogs-checkin-status/dialogs-checkin-status.component';
import { DialogsCancelComponent } from './dialogs-cancel/dialogs-cancel.component';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { SupplierCreateComponent } from './supplier-create/supplier-create.component';
import { AleartComponent } from './aleart/aleart.component';
import { DialogsConfirmOrderComponent } from './dialogs-confirm-order/dialogs-confirm-order.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { MySuppliersModule } from '../suppliers/my-suppliers/my-suppliers.module';
import { DeleteComponent } from './delete/delete.component';
import { RequestReplyComponent } from './request-reply/request-reply.component';
import { ProductWholesaleComponent } from './product-wholesale/product-wholesale.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
import { WarehouseCreateComponent } from './warehouse-create/warehouse-create.component';
import { WarehouseModule } from '../products/warehouse/warehouse.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    ThemeModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NbDialogModule.forChild(),
    NebularModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w',
      libraries: ['places'],
    }),
    MySuppliersModule,
    NgxSelectModule,
    WarehouseModule
    
  ],
  declarations: [
    DialogSuccessComponent,
    DialogsSavedListComponent,
    DialogsSupplierRequestComponent,
    DialogsSupplierWishlistComponent,
    DialogsProductGroupComponent,
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsConfirmPoComponent,
    DialogsCheckinStatusComponent,
    DialogsCancelComponent,
    NewFolderComponent,
    SupplierCreateComponent,
    AleartComponent,
    DialogsConfirmOrderComponent,
    ConfirmPaymentComponent,
    DeleteComponent,
    RequestReplyComponent,
    ProductWholesaleComponent,
    WarehouseCreateComponent
    
  ],

  entryComponents: [
    DialogSuccessComponent,
    DialogsSavedListComponent,
    DialogsSupplierRequestComponent,
    DialogsSupplierWishlistComponent,
    DialogsProductGroupComponent,
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsConfirmPoComponent,
    DialogsCheckinStatusComponent,
    DialogsCancelComponent,
    NewFolderComponent,
    SupplierCreateComponent,
    AleartComponent,
    DialogsConfirmOrderComponent,
    ConfirmPaymentComponent,
    DeleteComponent,
    RequestReplyComponent,
    ProductWholesaleComponent,
    WarehouseCreateComponent
  ]
})
export class DialogsModule { }
