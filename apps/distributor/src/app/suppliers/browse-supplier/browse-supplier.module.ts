import { NgModule } from '@angular/core';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowseSuppliersComponent } from './browse-suppliers-list/browse-suppliers.component';
import { AgmCoreModule } from '@agm/core';
import { BrowseSuppliersDetailComponent } from './browse-suppliers-detail/browse-suppliers-detail.component';
import { MapComponent } from './map/map.component';
import { LayoutsModule } from '../../layouts/layouts.module';
import { ProductComponent } from './product/product.component';
import { NameComponent } from './name/name.component';
import { CategoryComponent } from './category/category.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

 /* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
import { MapModule } from '../../map/map.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    ThemeModule,
    NebularModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w',
      libraries: ['places','geometry'],
    }),
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule
  ],
  declarations: [
    BrowseSuppliersComponent,
    BrowseSuppliersDetailComponent,
    MapComponent,
    ProductComponent,
    NameComponent,
    CategoryComponent,
  ],
})
export class BrowseSupplerModule { }
