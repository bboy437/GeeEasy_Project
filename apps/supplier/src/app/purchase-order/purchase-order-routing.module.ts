import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PurchaseComponent } from './purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';



const routes: Routes = [{

  path: '',
  component:  PurchaseComponent,
  children: [
    { path: 'list', component: PurchaseOrderListComponent, },
    { path: 'detail/:id', component: PurchaseOrderDetailComponent, },
  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {
}
