import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@project/theme-supplier';
import { NebularModule } from '@project/nebular';
import { NbDialogModule, } from '@nebular/theme';
import { DialogSuccessComponent } from './dialog-success/dialog-success.component';;
import { DialogsMapComponent } from './dialogs-map/dialogs-map.component';
import { AgmCoreModule } from '@agm/core';
import { DialogsImageComponent } from './dialogs-image/dialogs-image.component';
import { DialogsSavedListComponent } from './dialogs-saved-list/dialogs-saved-list.component';
import { DialogsWishlistComponent } from './dialogs-wishlist/dialogs-wishlist.component';
import { DialogsRequestComponent } from './dialogs-request/dialogs-request.component';
import { DialogsConfirmPoComponent } from './dialogs-confirm-po/dialogs-confirm-po.component';
import { DialogsReplyComponent } from './dialogs-reply/dialogs-reply.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DialogsCancelComponent } from './dialogs-cancel/dialogs-cancel.component';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { AleartComponent } from './aleart/aleart.component';
import { ProductWholesaleComponent } from './product-wholesale/product-wholesale.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '@project/shared';
import { WarehouseCreateComponent } from './warehouse-create/warehouse-create.component';
import { WarehouseModule } from '../products/warehouse/warehouse.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ThemeModule,
    NgxMaskModule.forRoot(options),
    NbDialogModule.forChild(),
    NebularModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w',
      libraries: ['places'],
    }),
    SharedModule,
    NgxMaskModule.forRoot(options),
    WarehouseModule,

  ],
  declarations: [
    DialogSuccessComponent,
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsSavedListComponent,
    DialogsWishlistComponent,
    DialogsRequestComponent,
    DialogsConfirmPoComponent,
    DialogsReplyComponent,
    DialogsCancelComponent,
    NewFolderComponent,
    AleartComponent,
    ProductWholesaleComponent,
    WarehouseCreateComponent,
  ],

  entryComponents: [
    DialogSuccessComponent,
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsSavedListComponent,
    DialogsWishlistComponent,
    DialogsRequestComponent,
    DialogsConfirmPoComponent,
    DialogsReplyComponent,
    DialogsCancelComponent,
    NewFolderComponent,
    AleartComponent,
    ProductWholesaleComponent,
    WarehouseCreateComponent

  ]
})
export class DialogsModule { }
