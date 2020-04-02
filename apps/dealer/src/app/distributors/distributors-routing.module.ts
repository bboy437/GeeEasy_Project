import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DistributorsComponent } from './distributors.component';
import { BrowseDistributorsListComponent } from './browse-distributors/browse-distributors-list/browse-distributors-list.component';
import { BrowseDistributorsDetailComponent } from './browse-distributors/browse-distributors-detail/browse-distributors-detail.component';


const routes: Routes = [
  {
    path: "",
    component:  DistributorsComponent,
    children: [
      {
        path: "browse-distributor/list",
        component: BrowseDistributorsListComponent
      },
      {
        path: "browse-distributor/detail/:id/:status",
        component: BrowseDistributorsDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  DistributorsRoutingModule { }
