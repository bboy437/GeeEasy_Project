import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MyDistributorsListComponent } from "./my-distributors-list/my-distributors-list.component";
import { VerifedListComponent } from "./verifed-list/verifed-list.component";
import { RequestListComponent } from "./request-list/request-list.component";
import { MyDistributorsComponent } from "./my-distributors.component";
import { FavoriteComponent } from './favorite-list/favorite.component';


const routes: Routes = [
  {
    path: "",
    component: MyDistributorsComponent,
    children: [
      { path: "list", component: MyDistributorsListComponent },
      { path: "veriferd/list", component: VerifedListComponent },
      { path: "request/list", component: RequestListComponent },
      { path: "favorite/list", component: FavoriteComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDistributorRoutingModule {}
