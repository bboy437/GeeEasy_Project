import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-supplier";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";

import { DialogsModule } from '../../dialogs/dialogs.module';
import { LayoutsModule } from '../../layouts/layouts.module';
import { MapModule } from '../../map/map.module';
import { ManageProductRoutingModule } from './manage-product-routing.module';
import { ManageProductComponent } from './manage-product.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    ManageProductRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DialogsModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule,
    NgxSelectModule
  ],
  declarations: [
    ManageProductComponent,
    ProductsListComponent,
    ProductsDetailComponent,
    ProductsCreateComponent


  ]
})
export class ManageProductModule { }
