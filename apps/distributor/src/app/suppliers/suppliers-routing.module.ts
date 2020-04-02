import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SavedListsComponent } from "./save-list/saved-lists/saved-lists.component";
import { BrowseSuppliersComponent } from "./browse-supplier/browse-suppliers-list/browse-suppliers.component";
import { BrowseSuppliersDetailComponent } from "./browse-supplier/browse-suppliers-detail/browse-suppliers-detail.component";
import { SuppliersComponent } from "./suppliers.component";
import { SavedDetailComponent } from './save-list/saved-detail/saved-detail.component';
import { MysupplierDetailComponent } from './my-suppliers/my-supplier-detail/my-supplier-detail.component';
import { VerifedSupplierDetailComponent } from './my-suppliers/verifed-supplier-detail/verifed-supplier-detail.component';
import { MysupplierSaveComponent } from './my-suppliers/mysupplier-save/mysupplier-save.component';
import { FavoriteDetailComponent } from './my-suppliers/favorite-detail/favorite-detail.component';
import { RequestDetailComponent } from './my-suppliers/request-detail/request-detail.component';


const routes: Routes = [
  {
    path: "",
    component: SuppliersComponent,
    children: [
      { path: "saved-lists", component: SavedListsComponent },
      { path: "saved-detail/:id", component: SavedDetailComponent },
      { path: "browse-suppliers", component: BrowseSuppliersComponent },
      {
        path: "browse-suppliers/detail/:id/:status",
        component: BrowseSuppliersDetailComponent
      },
      { path: "detail/:id", component: MysupplierDetailComponent },
      { path: "verifed/detail/:id", component: VerifedSupplierDetailComponent },
      { path: "wishlist/detail/:id", component: FavoriteDetailComponent },
      { path: "save/:id", component: MysupplierSaveComponent },
      { path: "request/detail/:id", component: RequestDetailComponent },
      {
        path: "my-suppliers",
        loadChildren: () =>
          import("./my-suppliers/my-suppliers.module").then(
            m => m.MySuppliersModule
          )
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
