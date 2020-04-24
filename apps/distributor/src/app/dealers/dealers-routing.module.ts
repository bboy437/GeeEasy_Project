import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DealersComponent } from "./dealers.component";
import { DealersListComponent } from "./dealers-list/dealers-list.component";
import { DealersSaveComponent } from "./dealers-save/dealers-save.component";
import { DealersDetailComponent } from "./dealers-detail/dealers-detail.component";
import { DealersSaveGuard } from './dealers-save/dealers-save-guard';

const routes: Routes = [
  {
    path: "",
    component: DealersComponent,
    children: [
      { path: "list", component: DealersListComponent },
      { path: "save/:id", canDeactivate: [DealersSaveGuard], component: DealersSaveComponent },
      { path: "detail/:id", component: DealersDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealersRoutingModule {}
