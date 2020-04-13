import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageStockComponent } from './manage-stock.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';


const routes: Routes = [
  {
    path: "",
    component: ManageStockComponent,
    children: [
      { path: "list", component: StockListComponent },
  
      { path: "detail/:id", component: StockDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStockRoutingModule { }
