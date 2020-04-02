import { NgModule } from '@angular/core';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponent } from './documents.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocOrderConfirmationComponent } from './doc-order-confirmation/doc-order-confirmation.component';
import { DocPurchaseOrderComponent } from './doc-purchase-order/doc-purchase-order.component';
import { DocCommercialInvoiceComponent } from './doc-commercial-invoice/doc-commercial-invoice.component';
import { DocProformaInvoiceComponent } from './doc-proforma-invoice/doc-proforma-invoice.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DocumentsRoutingModule,
    ThemeModule,
    NebularModule.forRoot(),

  ],
  declarations: [
    DocumentsComponent,
    DocOrderConfirmationComponent,
    DocPurchaseOrderComponent,
    DocCommercialInvoiceComponent,
    DocProformaInvoiceComponent
  ],

})
export class  DocumentsModule { }
