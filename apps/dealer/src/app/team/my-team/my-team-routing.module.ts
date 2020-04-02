import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyTeamComponent } from './my-team.component';
import { MyteamListComponent } from './myteam-list/myteam-list.component';
import { MyteamDetailComponent } from './myteam-detail/myteam-detail.component';
import { MyteamCreateComponent } from './myteam-create/myteam-create.component';
import { AddProductTeamComponent } from './add-product-team/add-product-team.component';
import { AddProductSellerComponent } from './add-product-seller/add-product-seller.component';



const routes: Routes = [{

  path: '',
  component: MyTeamComponent,
  children: [
    { path: 'list', component: MyteamListComponent, },
    { path: 'detail/:id/:status', component: MyteamDetailComponent, },
    { path: 'create/:id', component: MyteamCreateComponent, },
    { path: 'add-product-team/:id/:group_name/:status', component: AddProductTeamComponent, },
    { path: 'add-product-seller/:group_id/:user_id/:user_name/:status', component: AddProductSellerComponent, },
  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTeamRoutingModule {
}
