import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { BillsComponent } from "./bills.component";
import { BillsListComponent } from "./bills-list/bills-list.component";
import { BillsDetailComponent } from "./bills-detail/bills-detail.component";

const routes: Routes = [
  {
    path: "",
    component: BillsComponent,
    children: [
      { path: "list", component: BillsListComponent },
      { path: "detail/:id", component: BillsDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule {}
