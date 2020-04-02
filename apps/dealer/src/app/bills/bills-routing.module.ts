import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { BillsComponent } from "./bills.component";
import { OrdersBillsListComponent } from './orders-bills-list/orders-bills-list.component';
import { OrdersBillsDetailComponent } from './orders-bills-detail/orders-bills-detail.component';


const routes: Routes = [
  {
    path: "",
    component: BillsComponent,
    children: [
      { path: "order/list", component: OrdersBillsListComponent },
      { path: "order/detail/:id/:name", component: OrdersBillsDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule {}
