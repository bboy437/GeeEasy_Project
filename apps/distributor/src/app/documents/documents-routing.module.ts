import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DocumentsComponent } from './documents.component';
import { DocPurchaseOrderComponent } from './doc-purchase-order/doc-purchase-order.component';
import { DocProformaInvoiceComponent } from './doc-proforma-invoice/doc-proforma-invoice.component';
import { DocCommercialInvoiceComponent } from './doc-commercial-invoice/doc-commercial-invoice.component';
import { DocOrderConfirmationComponent } from './doc-order-confirmation/doc-order-confirmation.component';


const routes: Routes = [{

  path: '',
  component: DocumentsComponent,
  children: [
    { path: 'purchase-order/:id/:typeid/:status', component: DocPurchaseOrderComponent, },
    { path: 'proforma-invoice/:id/:typeid/:status', component: DocProformaInvoiceComponent, },
    { path: 'commercial-invoice/:id/:typeid/:status', component: DocCommercialInvoiceComponent, },
    { path: 'order-confirmation/:id/:typeid/:status', component: DocOrderConfirmationComponent, },
  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {
}
