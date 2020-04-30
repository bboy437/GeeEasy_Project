import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProductsComponent } from "./products.component";
import { ManageProductDetailComponent } from './manage-products/manage-products-detail/manage-products-detail.component';


const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      { path: "detail/:dealer_id/:product_id/:product_sku", component: ManageProductDetailComponent },
      {
        path: "manager-products",
        loadChildren: () =>
          import("./manage-products/manage-products.module").then(m => m.ManageProductsModule)
      },
      {
        path: "warehouse",
        loadChildren: () =>
          import("./warehouse/warehouse.module").then(m => m.WarehouseModule)
      },
      {
        path: "products",
        loadChildren: () =>
          import("./product/product.module").then(m => m.ProductModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
