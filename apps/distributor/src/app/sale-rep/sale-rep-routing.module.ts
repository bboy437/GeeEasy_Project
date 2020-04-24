import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SaleRepComponent } from './sale-rep.component';
import { SaleRepListComponent } from './sale-rep-list/sale-rep-list.component';
import { SaleRepDetailComponent } from './sale-rep-detail/sale-rep-detail.component';
import { SaleRepCreateComponent } from './sale-rep-create/sale-rep-create.component';
import { SaleRepCreateGuard } from './sale-rep-create/sale-rep-create-guard';


const routes: Routes = [
  {
    path: "",
    component: SaleRepComponent,
    children: [
      { path: "list", component: SaleRepListComponent },
      { path: "detail/:id", component: SaleRepDetailComponent },
      { path: "create/:id", canDeactivate: [SaleRepCreateGuard], component: SaleRepCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRepRoutingModule { }
