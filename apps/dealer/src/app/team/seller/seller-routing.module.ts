import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SellerComponent } from './seller.component';
import { SellerListComponent } from './seller-list/seller-list.component';
import { SellerDetailComponent } from './seller-detail/seller-detail.component';
import { SellerCreateComponent } from './seller-create/seller-create.component';
import { SellerProductDetailComponent } from './seller-product-detail/seller-product-detail.component';
import { SellerProductCreateComponent } from './seller-product-create/seller-product-create.component';
import { SellerCreateGuard } from './seller-create/seller-create-guard';
import { SellerProductCreateGuard } from './seller-product-create/seller-product-create-guard';



const routes: Routes = [
  {
    path: "",
    component: SellerComponent,
    children: [
      { path: "list", component: SellerListComponent },
      { path: "detail/:id/:status", component: SellerDetailComponent },
      { path: "create/:id", component: SellerCreateComponent, canDeactivate: [SellerCreateGuard], },
      { path: "product-detail/:seller_id/:id", component: SellerProductDetailComponent },
      { path: "product-create/:seller_id/:id", component: SellerProductCreateComponent, canDeactivate: [SellerProductCreateGuard], },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRepRoutingModule { }

