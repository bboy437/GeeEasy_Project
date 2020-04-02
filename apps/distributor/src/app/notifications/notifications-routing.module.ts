import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotificationsComponent } from "./notifications.component";
import { NotificationsListComponent } from "./notifications-list/notifications-list.component";

const routes: Routes = [
  {
    path: "",
    component: NotificationsComponent,
    children: [{ path: "list", component: NotificationsListComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {}
