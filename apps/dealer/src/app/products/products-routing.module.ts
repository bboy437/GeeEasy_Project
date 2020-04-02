import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProductsComponent } from "./products.component";
import { MyProductDetailComponent } from './my-product-detail/my-product-detail.component';


const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      { path: "detail/:dealer_id/:product_id/:product_sku", component: MyProductDetailComponent },
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
          import("./products/products.module").then(m => m.ProductsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
