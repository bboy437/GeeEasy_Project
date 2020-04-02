import { NgModule } from "@angular/core";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { ThemeModule } from "@project/theme-supplier";
import { DropFileModule } from '../drop-file/drop-file.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MapModule } from '../map/map.module';
import { NgxSelectModule } from 'ngx-select-ex';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { from } from 'rxjs';
import { DialogsModule } from '../dialogs/dialogs.module';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    ProductsRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DropFileModule,
    LayoutsModule,
    SharedModule,
    MapModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    NgxSelectModule,
    DialogsModule
  ],
  declarations: [
    ProductsComponent,
  ]
})
export class ProductsModule { }
