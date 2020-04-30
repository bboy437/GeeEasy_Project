import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { RetailerProductComponent } from "./retailer-product.component";
import { DealerProductPushComponent } from "./dealer-product-push/dealer-product-push.component";
import { RetailerProductDetailComponent } from './retailer-product-detail/retailer-product-detail.component';
import { RetailerProductCreateComponent } from './retailer-product-create/retailer-product-create.component';
import { RetailerProductCreateGuard } from './retailer-product-create/retailer-product-create-guard';


const routes: Routes = [
    {
        path: "",
        component: RetailerProductComponent,
        children: [
            { path: "detail/:retail_id/:id", component: RetailerProductDetailComponent },
            { path: "create/:retail_id/:id", component: RetailerProductCreateComponent, canDeactivate: [RetailerProductCreateGuard], },
            { path: "dealer/:retail_id/:id", component: DealerProductPushComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RetailerProductRoutingModule { }

