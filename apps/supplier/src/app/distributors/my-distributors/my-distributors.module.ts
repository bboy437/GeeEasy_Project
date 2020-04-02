import { NgModule } from "@angular/core";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MyDistributorsComponent } from "./my-distributors.component";
import { ThemeModule } from "@project/theme-supplier";
import { MyDistributorsDetailComponent } from "./my-distributors-detail/my-distributors-detail.component";
import { MyDistributorsCreateComponent } from "./my-distributors-create/my-distributors-create.component";
import { VerifedListComponent } from "./verifed-list/verifed-list.component";
import { VerifedDetailComponent } from "./verifed-detail/verifed-detail.component";
import { RequestListComponent } from "./request-list/request-list.component";
import { MyDistributorRoutingModule } from "./my-distributors-routing.module";
import { DropFileModule } from '../../drop-file/drop-file.module';
import { LayoutsModule } from '../../layouts/layouts.module';
import { MyDistributorsListComponent } from './my-distributors-list/my-distributors-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FavoriteDetailComponent } from "./favorite-detail/favorite-detail.component";

import { NgxSelectModule } from 'ngx-select-ex';


/* shared */
import { SharedModule } from "@project/shared";
import { MapModule } from '../../map/map.module';

import { IConfig, NgxMaskModule } from "ngx-mask";
import { FavoriteComponent } from './favorite-list/favorite.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    MapModule,
    FormsModule,
    ThemeModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    NebularModule.forRoot(),
    MyDistributorRoutingModule,
    DropFileModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    NgxSelectModule
  ],
  declarations: [
    FavoriteDetailComponent,
    FavoriteComponent,
    MyDistributorsComponent,
    MyDistributorsDetailComponent,
    MyDistributorsCreateComponent,
    VerifedListComponent,
    VerifedDetailComponent,
    RequestListComponent,
    MyDistributorsListComponent,
    RequestDetailComponent
  ]
})
export class MyDistributorsModule {}
