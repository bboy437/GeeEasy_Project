import { from } from 'rxjs';
import { NgModule } from "@angular/core";
import { MapModule } from '../../map/map.module';
import { SharedModule } from "@project/shared";
import { NebularModule } from "@project/nebular";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { ThemeModule } from "@project/theme-supplier";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { LayoutsModule } from '../../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DropFileModule } from '../../drop-file/drop-file.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgxSelectModule } from 'ngx-select-ex';

import { ProdectsRoutingModule } from "./products-routing.module";
import { ProductsComponent, SellerListComponent, ProductsDetailComponent, ProductsCreateComponent } from ".";

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    ProdectsRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DropFileModule,
    LayoutsModule,
    SharedModule,
    MapModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    NgxSelectModule
  ],
  declarations: [
    ProductsComponent,
    SellerListComponent,
    ProductsDetailComponent,
    ProductsCreateComponent
  ]
})
export class ProductsModule { }
