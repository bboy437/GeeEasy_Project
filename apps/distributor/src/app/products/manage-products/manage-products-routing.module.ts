import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageProductsComponent } from './manage-products.component';
import { MyProductComponent } from './manage-product-list/manage-product.component';
import { FarvoriteComponent } from './product-farvorite/product-farvorite.component';


const routes: Routes = [
  {
    path: "",
    component: ManageProductsComponent,
    children: [
      { path: "list", component: MyProductComponent },
      { path: "favorite", component: FarvoriteComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageProductsRoutingModule { }
