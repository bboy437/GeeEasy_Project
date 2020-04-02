import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { SaleRepComponent, SaleRepListComponent, SaleRepDetailComponent, SaleRepCreateComponent } from "./";


const routes: Routes = [
  {
    path: "",
    component: SaleRepComponent,
    children: [
      { path: "list", component: SaleRepListComponent },
      { path: "detail/:id", component: SaleRepDetailComponent },
      { path: "create/:id", component: SaleRepCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRepRoutingModule { }
