import { from } from 'rxjs';
import { NgModule } from "@angular/core";
import { MapModule } from '../../map/map.module';
import { SharedModule } from "@project/shared";
import { NebularModule } from "@project/nebular";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { ThemeModule } from "@project/theme-supplier";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { LayoutsModule } from '../../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DropFileModule } from '../../drop-file/drop-file.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgxSelectModule } from 'ngx-select-ex';

import { RetailerProductRoutingModule } from "./retailer-product-routing.module";

import { RetailerProductComponent } from "./retailer-product.component";
import { DealerProductPushComponent } from "./dealer-product-push/dealer-product-push.component";
import { RetailerProductDetailComponent } from './retailer-product-detail/retailer-product-detail.component';
import { RetailerProductCreateComponent } from './retailer-product-create/retailer-product-create.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ThemeModule,
        NebularModule.forRoot(),
        RetailerProductRoutingModule,
        NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
        DropFileModule,
        LayoutsModule,
        SharedModule,
        MapModule,
        NgxMaskModule.forRoot(options),
        NgxDatatableModule,
        NgxSelectModule
    ],
    declarations: [
        RetailerProductComponent,
        DealerProductPushComponent,
        RetailerProductDetailComponent,
        RetailerProductCreateComponent
    ]
})
export class RetailerProductModule { }