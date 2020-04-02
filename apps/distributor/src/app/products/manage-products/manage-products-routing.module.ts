import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageProductsComponent } from './manage-products.component';
import { MyProductComponent } from './my-product-list/my-product.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';


const routes: Routes = [
  {
    path: "",
    component: ManageProductsComponent,
    children: [
      { path: "list", component: MyProductComponent },
      { path: "create/:id", component: ProductsCreateComponent },
      { path: "detail-product-distributor/:id/:status", component: ProductsDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageProductsRoutingModule { }
