import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProductsComponent } from "./products.component";
import { MyProductDetailComponent } from "./my-product-detail/my-product-detail.component";
import { MyProductGroupComponent } from "./my-product-group-list/my-product-group.component";
import { InventoryLogListComponent } from "./inventory-log-list/inventory-log-list.component";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      { path: "group/list", component: MyProductGroupComponent },
      { path: "detail/:id", component: MyProductDetailComponent },
      { path: "inventory/log", component: InventoryLogListComponent },
      {
        path: "manage",
        loadChildren: () =>
          import("./manage-products/manage-products.module").then(m => m.ManageProductsModule)
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
export class ProductsRoutingModule {}
