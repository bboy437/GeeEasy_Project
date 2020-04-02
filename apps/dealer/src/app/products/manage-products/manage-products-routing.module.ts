import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageProductsComponent } from './manage-products.component';
import { OrderProductsComponent } from './order-products/order-products.component';
import { PoProductsComponent } from './po-products/po-products.component';


const routes: Routes = [
  {
    path: "",
    component: ManageProductsComponent,
    children: [
      { path: "order", component: OrderProductsComponent },
      { path: "po", component: PoProductsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageProductsRoutingModule { }
