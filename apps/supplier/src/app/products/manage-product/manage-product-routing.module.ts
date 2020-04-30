import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageProductComponent } from './manage-product.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { ProductCreateGuard } from './products-create/products-create-guard';
import { ProductResolver } from './product-resolver.service';

const routes: Routes = [
  {
    path: "",
    component: ManageProductComponent,
    children: [
      { path: "list", component: ProductsListComponent },
      {
        path: "detail/:id",
        component: ProductsDetailComponent,
        resolve: { resolvedData: ProductResolver },
      },
      {
        path: "create/:id",
        component: ProductsCreateComponent,
        canDeactivate: [ProductCreateGuard],
        resolve: { resolvedData: ProductResolver },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageProductRoutingModule { }
