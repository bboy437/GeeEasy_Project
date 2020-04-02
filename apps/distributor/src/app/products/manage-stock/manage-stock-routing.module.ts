import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageStockComponent } from './manage-stock.component';
import { StockCreateComponent } from './stock-create/stock-create.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';



const routes: Routes = [
  {
    path: "",
    component: ManageStockComponent,
    children: [
      { path: "list", component: StockListComponent },
      { path: "create/:id", component: StockCreateComponent },
      { path: "detail/:id", component: StockDetailComponent },
      { path: "transfer", component: TransferListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStockRoutingModule { }
