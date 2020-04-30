import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountsComponent } from './accounts.component';
import { InfoListComponent } from './info-list/info-list.component';
import { InfoListGuard } from './info-list/info-list-guard';




const routes: Routes = [{

  path: '',
  component: AccountsComponent,
  children: [
    { path: 'info/list', component: InfoListComponent, canDeactivate: [InfoListGuard], },

  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {
}
