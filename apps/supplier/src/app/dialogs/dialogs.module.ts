import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@project/theme-supplier';
import { NebularModule } from '@project/nebular';
import { NbDialogModule, } from '@nebular/theme';
import { DialogsMapComponent } from './dialogs-map/dialogs-map.component';
import { AgmCoreModule } from '@agm/core';
import { DialogsImageComponent } from './dialogs-image/dialogs-image.component';
import { DialogsSavedListComponent } from './dialogs-saved-list/dialogs-saved-list.component';
import { DialogsReplyRequestComponent } from './dialogs-reply-request/dialogs-reply-request.component';
import { DialogsConfirmPoComponent } from './dialogs-confirm-po/dialogs-confirm-po.component';
import { DialogsCancelComponent } from './dialogs-cancel/dialogs-cancel.component';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { AleartComponent } from './aleart/aleart.component';
import { ProductWholesaleComponent } from './product-wholesale/product-wholesale.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '@project/shared';
import { WarehouseCreateComponent } from './warehouse-create/warehouse-create.component';
import { WarehouseModule } from '../products/warehouse/warehouse.module';
import { DialogsReplyPOComponent } from './dialogs-reply-po/dialogs-reply-po.component';

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
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsSavedListComponent,
    DialogsReplyRequestComponent,
    DialogsConfirmPoComponent,
    DialogsReplyPOComponent,
    DialogsCancelComponent,
    NewFolderComponent,
    AleartComponent,
    ProductWholesaleComponent,
    WarehouseCreateComponent,
  ],

  entryComponents: [
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsSavedListComponent,
    DialogsReplyRequestComponent,
    DialogsConfirmPoComponent,
    DialogsReplyPOComponent,
    DialogsCancelComponent,
    NewFolderComponent,
    AleartComponent,
    ProductWholesaleComponent,
    WarehouseCreateComponent

  ]
})
export class DialogsModule { }
