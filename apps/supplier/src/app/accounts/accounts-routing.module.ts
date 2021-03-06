import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountsComponent } from './accounts.component';
import { InfoListComponent } from './info-list/info-list.component';
import { DeliveryInformationListComponent } from './delivery-information-list/delivery-information-list.component';
import { InfoListGuard } from './info-list/info-list-guard';
import { DeliveryInformationListGuard } from './delivery-information-list/delivery-information-list-guard';


const routes: Routes = [{

  path: '',
  component: AccountsComponent,
  children: [
    { path: 'info/list', component: InfoListComponent, canDeactivate: [InfoListGuard], },
    { path: 'delivery-information/list', component: DeliveryInformationListComponent, canDeactivate: [DeliveryInformationListGuard],  },
  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {
}
