import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { RetailerComponent, RetailerListComponent, RetailerDetailComponent, RetailerCreateComponent } from ".";


const routes: Routes = [
  {
    path: "",
    component: RetailerComponent,
    children: [
      { path: "list", component: RetailerListComponent },
      { path: "detail/:id", component: RetailerDetailComponent },
      { path: "create/:id", component: RetailerCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailerRoutingModule { }

