import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CheckInComponent } from "./check-in.component";
import { CheckInListComponent } from "./check-in-list/check-in-list.component";
import { CheckInDetailComponent } from "./check-in-detail/check-in-detail.component";

const routes: Routes = [
  {
    path: "",
    component: CheckInComponent,
    children: [
      { path: "list", component: CheckInListComponent },
      { path: "detail/:id/:status", component: CheckInDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckInRoutingModule {}
