import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProductsComponent } from "./products.component";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      {
        path: "manage",
        data: { preload: false },
        loadChildren: () =>
          import("./manage-product/manage-product.module").then(m => m.ManageProductModule)
      },
      {
        path: "stock",
        loadChildren: () =>
          import("./manage-stock/manage-stock.module").then(m => m.ManageStockModule)
      },
      {
        path: "warehouse",
        loadChildren: () =>
          import("./warehouse/warehouse.module").then(m => m.WarehouseModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
