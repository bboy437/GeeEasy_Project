import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountsComponent } from './accounts.component';
import { InfoListComponent } from './info-list/info-list.component';




const routes: Routes = [{

  path: '',
  component: AccountsComponent,
  children: [
    { path: 'info/list', component: InfoListComponent, },

  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {
}
