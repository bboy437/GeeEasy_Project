import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { CoresModule } from "@project/cores";
import { AppRoutingModule } from "./app-routing.module";
import { NbMenuModule, NbSidebarModule } from "@nebular/theme";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import {
  BillingAPIService,
  LocationAPIService,
  SupplierAPIService,
  BrowseSupplierAPIService,
  PurchaseAPIService,
  CheckinAPIService,
  WarehouseAPIService,
  ProductAPIService,
  DealerAPIService,
  OrderAPIService,
  SaveListSupplierAPIService,
  MessagesAPIService,
  UploadAPIService,
  DashboardAPIService,
  SaleRepService,
  DistributorAPIService
} from "@project/services";
import { DialogsModule } from "./dialogs/dialogs.module";
import { NgbdSortableHeader } from "./sortableheader/sortable.directive";
import { LayoutsModule } from "./layouts/layouts.module";
import { DropFileModule } from "./drop-file/drop-file.module";
import { MapModule } from './map/map.module';

@NgModule({
  declarations: [AppComponent, NgbdSortableHeader],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    CoresModule.forRoot(),
    DialogsModule,
    LayoutsModule,
    DropFileModule,
    MapModule
  ],
  providers: [
    BillingAPIService,
    SupplierAPIService,
    LocationAPIService,
    BrowseSupplierAPIService,
    PurchaseAPIService,
    WarehouseAPIService,
    CheckinAPIService,
    ProductAPIService,
    DealerAPIService,
    OrderAPIService,
    SaveListSupplierAPIService,
    MessagesAPIService,
    UploadAPIService,
    DashboardAPIService,
    SaleRepService,
    DistributorAPIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
