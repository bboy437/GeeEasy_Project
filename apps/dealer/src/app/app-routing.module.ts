import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboards",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: "distributors",
    loadChildren: () =>
      import("./distributors/distributors.module").then(m => m.DistributorsModule)
  },
  {
    path: "team",
    loadChildren: () =>
      import("./team/team.module").then(m => m.TeamModule)
  },
  {
    path: "retailers",
    loadChildren: () =>
      import("./retailers/retailers.module").then(m => m.RetailersModule)
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.module").then(m => m.OrderModule)
  },
  {
    path: "bills",
    loadChildren: () => import("./bills/bills.module").then(m => m.BillsModule)
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.module").then(m => m.ProductsModule)
  },
  {
    path: "account",
    loadChildren: () =>
      import("./accounts/accounts.module").then(m => m.AccountsModule)
  },
  {
    path: "messages",
    loadChildren: () =>
      import("./messages/messages.module").then(
        m => m.MessagesModule
      )
  },
  {
    path: "file-manager",
    loadChildren: () =>
      import("./filemanager/filemanager.module").then(
        m => m.FileManagerModule
      )
  },
  { path: "**", redirectTo: "dashboard" }
];

const config: ExtraOptions = {
  useHash: false
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
