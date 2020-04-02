import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { ProductsComponent, SellerListComponent, ProductsDetailComponent, ProductsCreateComponent } from ".";


const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      { path: "list", component: SellerListComponent },
      { path: "detail/:id", component: ProductsDetailComponent },
      { path: "create/:id", component: ProductsCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdectsRoutingModule { }

