import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NotificationsComponent } from "./notifications.component";
import { NotificationsRoutingModule } from "./notifications-routing.module";
import { NotificationsListComponent } from "./notifications-list/notifications-list.component";
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    NotificationsRoutingModule,LayoutsModule
  ],
  declarations: [NotificationsComponent, NotificationsListComponent]
})
export class NotificationsModule {}
