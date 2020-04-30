import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-supplier";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule } from "@agm/core";
import { BrowseDistributorsListComponent } from "./browse-distributors-list/browse-distributors-list.component";
import { BrowseDistributorsDetailComponent } from "./browse-distributors-detail/browse-distributors-detail.component";
import { MapComponent } from "./map/map.component";
import { DialogsModule } from "../../dialogs/dialogs.module";
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
    MapModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    ThemeModule,
    NebularModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w",
      libraries: ["places"]
    }),
    DialogsModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
  ],
  declarations: [
    BrowseDistributorsListComponent,
    BrowseDistributorsDetailComponent,
    MapComponent,
    ProductComponent,
    NameComponent,
    CategoryComponent

  ]
})
export class BrowseDistributorModule {}
