import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PurchaseComponent } from './purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderSaveComponent } from './purchase-order-save/purchase-order-save.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseOrderCreateComponent } from './purchase-order-create/purchase-order-create.component';
import { PurchaseReorderComponent } from './purchase-reorder/purchase-reorder.component';

const routes: Routes = [{

  path: '',
  component:  PurchaseComponent,
  children: [
    { path: 'list', component: PurchaseOrderListComponent, },
    { path: 'detail/:status/:id', component: PurchaseOrderDetailComponent, },
    { path: 'save', component: PurchaseOrderSaveComponent, },
    { path: 'create', component: PurchaseOrderCreateComponent, },
    { path: 'reorder/:status/:id', component: PurchaseReorderComponent, },
  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {
}
