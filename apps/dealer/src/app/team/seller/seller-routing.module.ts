import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SellerComponent, SellerListComponent, SellerDetailComponent, SellerCreateComponent } from "./";
import { SellerProductDetailComponent } from './seller-product-detail/seller-product-detail.component';
import { SellerProductCreateComponent } from './seller-product-create/seller-product-create.component';


const routes: Routes = [
  {
    path: "",
    component: SellerComponent,
    children: [
      { path: "list", component: SellerListComponent },
      { path: "detail/:id/:status", component: SellerDetailComponent },
      { path: "create/:id", component: SellerCreateComponent },
      { path: "product-detail/:seller_id/:id", component: SellerProductDetailComponent },
      { path: "product-create/:seller_id/:id", component: SellerProductCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRepRoutingModule { }

