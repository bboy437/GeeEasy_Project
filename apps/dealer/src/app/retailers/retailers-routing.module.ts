import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RetailersComponent } from './retailers.component';



const routes: Routes = [{

    path: '',
    component: RetailersComponent,
    children: [
        {
            path: 'retailer', loadChildren: () =>
                import("./retailer/retailer.module").then(
                    m => m.RetailerModule
                )
        }, {
            path: 'product', loadChildren: () =>
                import("./retailer-product/retailer-product.module").then(
                    m => m.RetailerProductModule
                )
        }
    ],

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RetailersRoutingModule { }

