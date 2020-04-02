import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-dealer";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { DialogsModule } from "../dialogs/dialogs.module";
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule} from 'ngx-select-ex';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { MapModule } from '../map/map.module';
import { MyProductDetailComponent } from './my-product-detail/my-product-detail.component';
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
    MyProductDetailComponent,

  ]
})
export class ProductsModule {}
