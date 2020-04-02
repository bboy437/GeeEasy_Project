import { NgModule } from '@angular/core';
import { ThemeModule } from '@project/theme-supplier';
import { NebularModule } from '@project/nebular';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: 'dd/MM/yyyy' }),
    NotificationsRoutingModule
  ],
  declarations: [
    NotificationsComponent,
    NotificationsListComponent
  ],
})

export class NotificationsModule { }
