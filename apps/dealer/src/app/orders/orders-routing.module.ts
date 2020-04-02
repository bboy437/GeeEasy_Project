import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { OrdersComponent } from "./orders.component";
import { OrdersCreateComponent } from "./orders-create/orders-create.component";
import { OrdersSaveComponent } from "./orders-save/orders-save.component";
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrdersDetailComponent } from "./orders-detail/orders-detail.component";

const routes: Routes = [
  {
    path: "",
    component: OrdersComponent,
    children: [
      { path: "list", component: OrdersListComponent },
      { path: "detail/:id/:name", component: OrdersDetailComponent },
      { path: "save/:id", component: OrdersSaveComponent },
      { path: "create", component: OrdersCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
