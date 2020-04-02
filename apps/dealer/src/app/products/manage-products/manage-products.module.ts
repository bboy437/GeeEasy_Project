import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-dealer";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
/* shared */
import { SharedModule } from "@project/shared";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { LayoutsModule } from '../../layouts/layouts.module';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { MapModule } from '../../map/map.module';
import { ManageProductsComponent } from './manage-products.component';
import { ManageProductsRoutingModule } from './manage-products-routing.module';
import { OrderProductsComponent } from './order-products/order-products.component';
import { PoProductsComponent } from './po-products/po-products.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DialogsModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule,
    NgxSelectModule,
    ManageProductsRoutingModule
  ],
  declarations: [
    ManageProductsComponent,
    OrderProductsComponent,
    PoProductsComponent

  ]
})
export class ManageProductsModule {}
