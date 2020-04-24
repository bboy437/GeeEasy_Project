import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MysupplierSaveComponent } from "./my-supplier/my-supplier-save/my-supplier-save.component";
import { MySuppliersComponent } from "./my-suppliers.component";
import { VerifedSupplierComponent } from "./verifed-supplier/verifed-supplier-list/verifed-supplier.component";
import { InviteOutsoureSupplierComponent } from "./invite-outsoure/invite-outsoure-supplier/invite-outsoure-supplier.component";
import { MySupplierListComponent } from "./my-supplier/my-supplier-list/my-supplier-list.component";
import { NbSelectModule } from "@nebular/theme";
import { TextMaskModule } from "angular2-text-mask";
import { MysupplierDetailComponent } from "./my-supplier/my-supplier-detail/my-supplier-detail.component";
import { VerifedSupplierDetailComponent } from "./verifed-supplier/verifed-supplier-detail/verifed-supplier-detail.component";
import { MySuppliersRoutingModule } from "./my-suppliers-routing.module";
import { DropFileModule } from "../../drop-file/drop-file.module";
import { ListComponent } from "./my-supplier/my-supplier-list/list/list.component";
import { LayoutsModule } from "../../layouts/layouts.module";
import { FavoriteDetailComponent } from "./favorite/favorite-detail/favorite-detail.component";

/* shared */
import { SharedModule } from "@project/shared";
import { NgxSelectModule } from 'ngx-select-ex';
import { IConfig, NgxMaskModule } from "ngx-mask";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { MapModule } from '../../map/map.module';
import { FavoriteComponent } from './favorite/favorite-list/favorite.component';
import { RequestListComponent } from './request/request-list/request-list.component';
import { RequestDetailComponent } from './request/request-detail/request-detail.component';
import { AddProductComponent } from './my-supplier/my-supplier-detail/add-product/add-product.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    NebularModule.forRoot(),
    NbSelectModule,
    TextMaskModule,
    MySuppliersRoutingModule,
    DropFileModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule,
    NgxSelectModule
  ],
  declarations: [
    MySuppliersComponent,
    MysupplierSaveComponent,
    MysupplierDetailComponent,
    VerifedSupplierDetailComponent,
    VerifedSupplierComponent,
    InviteOutsoureSupplierComponent,
    MySupplierListComponent,
    FavoriteComponent,
    ListComponent,
    FavoriteDetailComponent,
    RequestListComponent,
    RequestDetailComponent,
    AddProductComponent
  ],
  exports: [ListComponent,MysupplierSaveComponent]
})
export class MySuppliersModule {}
