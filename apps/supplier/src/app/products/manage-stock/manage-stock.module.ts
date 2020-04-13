import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-supplier";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ManageStockComponent } from './manage-stock.component';
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';

/* shared */
import { SharedModule } from "@project/shared";
import { StockListComponent } from './stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { IConfig, NgxMaskModule } from "ngx-mask";
import { DialogsModule } from '../../dialogs/dialogs.module';
import { LayoutsModule } from '../../layouts/layouts.module';
import { MapModule } from '../../map/map.module';
import { ManageStockRoutingModule } from './manage-stock-routing.module';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    ManageStockRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DialogsModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule,
    NgxSelectModule,
    
  ],
  declarations: [
    ManageStockComponent,
    StockListComponent,
    StockDetailComponent

  ]
})
export class ManageStockModule { }
