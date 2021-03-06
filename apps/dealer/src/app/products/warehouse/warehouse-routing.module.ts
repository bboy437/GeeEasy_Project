import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseCreateComponent } from './warehouse-create/warehouse-create.component';
import { WarehouseDetailComponent } from './warehouse-detail/warehouse-detail.component';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseCreateGuard } from './warehouse-create/warehouse-create-guard';


const routes: Routes = [
  {
    path: "",
    component: WarehouseComponent,
    children: [
      { path: "list", component: WarehouseListComponent },
      { path: "create/:id", component: WarehouseCreateComponent, canDeactivate: [WarehouseCreateGuard], },
      { path: "detail/:id", component: WarehouseDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
