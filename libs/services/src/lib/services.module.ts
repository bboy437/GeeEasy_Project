import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';
import { SupplierAPIService } from './services/supplierapi.service';
import { AccountAPIService } from './services/accountapi.service';
import { AnalyticsAPIService } from './services/analyticsapi.service';
import { BillingAPIService } from './services/billingapi.service';
import { BrowseSupplierAPIService } from './services/browsesupplierapi.service';
import { DealerAPIService } from './services/dealerapi.service';
import { OrderAPIService } from './services/orderapi.service';
import { ProductAPIService } from './services/productapi.service';
import { PurchaseAPIService } from './services/purchasesapi.service';
import { LocationAPIService } from './services/location.service';
import { WarehouseAPIService } from './services/warehouseapi.service';
import { CheckinAPIService } from './services/checkinapi.service';
import { NgbdSortableHeader } from './components/sortableheader/sortable.directive';
import { SaveListSupplierAPIService } from './services/savelistapi.service';
import { DistributorAPIService } from './services/distributorapi.service';
import { MessagesAPIService } from './services/messagesapi.service';
import { DashboardAPIService } from './services/dashboardapi.service';
import { TeamAPIService } from './services/team.service';
import { RetailAccountService } from "./services/retailAccount.service";
import { RetailProductService } from "./services/retailProduct.service";

@NgModule({
    imports: [
        CommonModule,
        ThemeModule.forRoot(),
        NebularModule.forRoot(),
    ],
    declarations: [
        NgbdSortableHeader
    ],
    providers: [
        SupplierAPIService,
        AccountAPIService,
        AnalyticsAPIService,
        BillingAPIService,
        BrowseSupplierAPIService,
        DealerAPIService,
        OrderAPIService,
        ProductAPIService,
        PurchaseAPIService,
        LocationAPIService,
        WarehouseAPIService,
        CheckinAPIService,
        SaveListSupplierAPIService,
        DistributorAPIService,
        MessagesAPIService,
        DashboardAPIService,
        TeamAPIService,
        RetailAccountService,
        RetailProductService
    ],
})
export class ServicesModule {

}
