import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MySuppliersComponent } from "./my-suppliers.component";
import { VerifedSupplierComponent } from "./verifed-supplier/verifed-supplier-list/verifed-supplier.component";
import { MySupplierListComponent } from "./my-supplier/my-supplier-list/my-supplier-list.component";
import { FavoriteComponent } from './favorite/favorite-list/favorite.component';
import { RequestListComponent } from './request/request-list/request-list.component';


const routes: Routes = [
  {
    path: "",
    component: MySuppliersComponent,
    children: [
      { path: "verifed/list", component: VerifedSupplierComponent },
      { path: "list", component: MySupplierListComponent },
      { path: "favorite/list", component: FavoriteComponent },
      { path: "request/list", component: RequestListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MySuppliersRoutingModule {}
