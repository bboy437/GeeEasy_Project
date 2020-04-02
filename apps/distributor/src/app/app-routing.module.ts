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
    path: "suppliers",
    loadChildren: () =>
      import("./suppliers/suppliers.module").then(m => m.SuppliersModule)
  },
  {
    path: "purchases",
    loadChildren: () =>
      import("./purchase-order/purchase-order.module").then(
        m => m.PurchaseOrderModule
      )
  },
  {
    path: "check-in",
    loadChildren: () =>
      import("./check-in/check-in.module").then(m => m.CheckInModule)
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
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.module").then(m => m.OrderModule)
  },
  {
    path: "dealers",
    loadChildren: () =>
      import("./dealers/dealers.module").then(m => m.DealersModule)
  },
  {
    path: "messages",
    loadChildren: () =>
      import("./messages/messages.module").then(
        m => m.MessagesModule
      )
  },
  {
    path: "notifications",
    loadChildren: () =>
      import("./notifications/notifications.module").then(
        m => m.NotificationsModule
      )
  },
  {
    path: "account",
    loadChildren: () =>
      import("./accounts/accounts.module").then(m => m.AccountsModule)
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.module").then(m => m.ReportsModule)
  },
  {
    path: "file-manager",
    loadChildren: () =>
      import("./filemanager/filemanager.module").then(m => m.FileManagerModule)
  },
  {
    path: "sale-rep",
    loadChildren: () =>
      import("./sale-rep/sale-rep.module").then(
        m => m.SaleRepModule
      )
  },
  {
    path: "doucuments",
    loadChildren: () =>
      import("./documents/documents.module").then(m => m.DocumentsModule)
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
