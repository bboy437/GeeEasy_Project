import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RetailerComponent } from './retailer.component';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { RetailerDetailComponent } from './retailer-detail/retailer-detail.component';
import { RetailerCreateComponent } from './retailer-create/retailer-create.component';
import { RetailerCreateGuard } from './retailer-create/retailer-create-guard';

const routes: Routes = [
  {
    path: "",
    component: RetailerComponent,
    children: [
      { path: "list", component: RetailerListComponent },
      { path: "detail/:id", component: RetailerDetailComponent },
      { path: "create/:id", component: RetailerCreateComponent, canDeactivate: [RetailerCreateGuard], }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailerRoutingModule { }

