import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';
import { NgbdSortableHeader } from './components/sortableheader/sortable.directive';
import { ProductSupplierResolver } from './resolver/product-supplier-resolver.service';


@NgModule({
    imports: [
        CommonModule,
        ThemeModule.forRoot(),
        NebularModule.forRoot(),
    ],
    declarations: [
        NgbdSortableHeader,
    ],
    providers: [],
})
export class ServicesModule {

}
