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

import { SaleRepRoutingModule } from "./seller-routing.module";
import { SellerComponent } from './seller.component';
import { SellerListComponent } from './seller-list/seller-list.component';
import { SellerDetailComponent } from './seller-detail/seller-detail.component';
import { SellerCreateComponent } from './seller-create/seller-create.component';
import { SellerProductDetailComponent } from './seller-product-detail/seller-product-detail.component';
import { SellerProductCreateComponent } from './seller-product-create/seller-product-create.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    SaleRepRoutingModule,
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
    SellerComponent,
    SellerListComponent,
    SellerDetailComponent,
    SellerCreateComponent,
    SellerProductDetailComponent,
    SellerProductCreateComponent
  ]
})
export class SellerModule { }
