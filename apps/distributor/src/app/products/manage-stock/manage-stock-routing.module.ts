import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageStockComponent } from './manage-stock.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';



const routes: Routes = [
  {
    path: "",
    component: ManageStockComponent,
    children: [
      { path: "list", component: StockListComponent },
      { path: "transfer", component: TransferListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStockRoutingModule { }
