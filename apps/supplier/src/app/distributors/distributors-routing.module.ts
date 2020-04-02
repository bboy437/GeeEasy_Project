import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DistributorsComponent } from "./distributors.component";
import { BrowseDistributorsListComponent } from "./browse-distributors/browse-distributors-list/browse-distributors-list.component";
import { SavedListsComponent } from "./saved-lists/saved-lists/saved-lists.component";
import { BrowseDistributorsDetailComponent } from "./browse-distributors/browse-distributors-detail/browse-distributors-detail.component";
import { SavesDetailComponent } from './saved-lists/saves-detail/saves-detail.component';
import { MyDistributorsDetailComponent } from './my-distributors/my-distributors-detail/my-distributors-detail.component';
import { VerifedDetailComponent } from './my-distributors/verifed-detail/verifed-detail.component';
import { MyDistributorsCreateComponent } from './my-distributors/my-distributors-create/my-distributors-create.component';
import { FavoriteDetailComponent } from './my-distributors/favorite-detail/favorite-detail.component';
import { RequestDetailComponent } from './my-distributors/request-detail/request-detail.component';

const routes: Routes = [
  {
    path: "",
    component: DistributorsComponent,
    children: [
      {
        path: "browse-distributor/list",
        component: BrowseDistributorsListComponent
      },
      {
        path: "browse-distributor/detail/:id/:status",
        component: BrowseDistributorsDetailComponent
      },
      { path: "detail/:id", component: MyDistributorsDetailComponent },
      { path: "saved-lists", component: SavedListsComponent },
      { path: "saved-detail/:id", component: SavesDetailComponent },
      { path: "create/:id", component: MyDistributorsCreateComponent },
      { path: "veriferd/detail/:id", component: VerifedDetailComponent },
      { path: "wishlist/detail/:id", component: FavoriteDetailComponent },
      { path: "request/detail/:id", component: RequestDetailComponent },
      {
        path: "my-distributor",
        loadChildren: () =>
          import("./my-distributors/my-distributors.module").then(
            m => m.MyDistributorsModule
          )
      } 
      /* 
        { path: 'my-distributor/list', component: MyDistributorsComponent, },
        { path: 'my-distributor/detail/:id', component: MyDistributorsDetailComponent, },
        { path: 'my-distributor/create/:id', component: MyDistributorsCreateComponent, },
        { path: 'veriferd/detail/:id', component: VerifedDetailComponent, },
        { path: 'veriferd/list', component: VerifedListComponent, },
        { path: 'request/list', component: RequestListComponent, }, 
      */
      /**
       * backup
       */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule {}
