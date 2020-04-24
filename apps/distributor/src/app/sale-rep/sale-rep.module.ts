import { from } from 'rxjs';
import { NgModule } from "@angular/core";
import { MapModule } from '../map/map.module';
import { SharedModule } from "@project/shared";
import { NebularModule } from "@project/nebular";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { ThemeModule } from "@project/theme-supplier";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { SaleRepComponent } from "./sale-rep.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DropFileModule } from '../drop-file/drop-file.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSelectModule } from 'ngx-select-ex';
import { SaleRepRoutingModule } from "./sale-rep-routing.module";
import { SaleRepListComponent } from './sale-rep-list/sale-rep-list.component';
import { SaleRepDetailComponent } from './sale-rep-detail/sale-rep-detail.component';
import { SaleRepCreateComponent } from './sale-rep-create/sale-rep-create.component';


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
    SaleRepComponent,
    SaleRepListComponent,
    SaleRepDetailComponent,
    SaleRepCreateComponent
  ]
})
export class SaleRepModule { }
