import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProductsDetailComponent } from './product-detail/product-detail.component';
import { ProductsCreateComponent } from './product-create/product-create.component';
import { ProductComponent } from './product.component';
import { ProductCreateGuard } from './product-create/product-create-guard';


const routes: Routes = [
  {
    path: "",
    component: ProductComponent,
    children: [
      { path: "detail/:id", component: ProductsDetailComponent },
      { path: "create/:id", component: ProductsCreateComponent, canDeactivate: [ProductCreateGuard], },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdectsRoutingModule { }

