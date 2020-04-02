import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { RetailersComponent, RetailerProductModule } from ".";


const routes: Routes = [{

    path: '',
    component: RetailersComponent,
    children: [
        {
            path: 'retailer', loadChildren: () =>
                import("./").then(
                    m => m.RetailerModule
                )
        }, {
            path: 'product', loadChildren: () =>
                import("./").then(
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

