import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MyProductGroupComponent } from "./products-group/my-product-group-list/product-group.component";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { DialogsModule } from "../dialogs/dialogs.module";
import { InventoryLogListComponent } from "./inventory-log/inventory-log-list/inventory-log-list.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { MapModule } from '../map/map.module';
import { ProductsCreateComponent } from './manage-products/products-create/products-create.component';
import { ProductsDetailComponent } from './manage-products/products-detail/products-detail.component';
import { MyProductDetailComponent } from './manage-products/manage-product-detail/manage-product-detail.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    ProductsRoutingModule,
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
    ProductsComponent,
    MyProductGroupComponent,
    MyProductDetailComponent,
    InventoryLogListComponent,
    ProductsCreateComponent,
    ProductsDetailComponent
  ]
})
export class ProductsModule {}
