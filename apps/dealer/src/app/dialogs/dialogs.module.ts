import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@project/theme-dealer';
import { NebularModule } from '@project/nebular';
import { NbDialogModule, } from '@nebular/theme';
import { DialogsMapComponent } from './dialogs-map/dialogs-map.component';
import { AgmCoreModule } from '@agm/core';
import { DialogsImageComponent } from './dialogs-image/dialogs-image.component';
import { DialogsConfirmPoComponent } from './dialogs-confirm-po/dialogs-confirm-po.component';
import { DialogsCancelComponent } from './dialogs-cancel/dialogs-cancel.component';
import { AleartComponent } from './aleart/aleart.component';
import { DialogsConfirmOrderComponent } from './dialogs-confirm-order/dialogs-confirm-order.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { NgxSelectModule} from 'ngx-select-ex';
/* shared */
import { SharedModule } from "@project/shared";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { DialogsTeamComponent } from './dialogs-team/dialogs-team.component';
import { DialogSuccessComponent } from './dialog-success/dialog-success.component';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { DialogsTeamCreateComponent } from './dialogs-team-create/dialogs-team-create.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeleteComponent } from './delete/delete.component';



export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

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
    NgxSelectModule,
    NgxDatatableModule,
    // MatGoogleMapsAutocompleteModule
  ],
  declarations: [
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsConfirmPoComponent,
    DialogsCancelComponent,
    AleartComponent,
    DialogsConfirmOrderComponent,
    ConfirmPaymentComponent,
    DialogsTeamComponent,
    DialogSuccessComponent,
    NewFolderComponent,
    DialogsTeamCreateComponent,
    DeleteComponent
    
  ],

  entryComponents: [
    DialogsMapComponent,
    DialogsImageComponent,
    DialogsConfirmPoComponent,
    DialogsCancelComponent,
    AleartComponent,
    DialogsConfirmOrderComponent,
    ConfirmPaymentComponent,
    DialogsTeamComponent,
    DialogSuccessComponent,
    NewFolderComponent,
    DialogsTeamCreateComponent,
    DeleteComponent
  ]
})
export class DialogsModule { }
