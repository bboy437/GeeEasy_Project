import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WarehouseComponent } from "./warehouse.component";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseDetailComponent } from './warehouse-detail/warehouse-detail.component';
import { WarehouseCreateComponent } from './warehouse-create/warehouse-create.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { LayoutsModule } from '../../layouts/layouts.module';
import { MapModule } from '../../map/map.module';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    WarehouseRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    // DialogsModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule,
    NgxSelectModule
  ],
  declarations: [
    WarehouseComponent,
    WarehouseListComponent,
    WarehouseDetailComponent,
    WarehouseCreateComponent,

  ],
  exports: [WarehouseCreateComponent]
})
export class WarehouseModule { }
