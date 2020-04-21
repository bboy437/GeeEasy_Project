import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProductsComponent } from "./products.component";
import { MyProductGroupComponent } from "./my-product-group-list/my-product-group.component";
import { InventoryLogListComponent } from "./inventory-log-list/inventory-log-list.component";
import { ProductsCreateComponent } from './manage-products/products-create/products-create.component';
import { ProductsDetailComponent } from './manage-products/products-detail/products-detail.component';
import { MyProductDetailComponent } from './manage-products/manage-product-detail/manage-product-detail.component';

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      { path: "group/list", component: MyProductGroupComponent },
      { path: "detail/:id", component: MyProductDetailComponent },
      { path: "inventory/log", component: InventoryLogListComponent },
      { path: "manage/create/:id", component: ProductsCreateComponent },
      { path: "manage/detail-product-distributor/:id/:status", component: ProductsDetailComponent },
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
