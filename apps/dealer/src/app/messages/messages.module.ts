import { NgModule } from '@angular/core';
import { ThemeModule } from '@project/theme-dealer';
import { NebularModule } from '@project/nebular';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbChatModule } from '@nebular/theme';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { DropFileModule } from '../drop-file/drop-file.module';


@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: 'dd/MM/yyyy' }),
    NbChatModule, 
    MessagesRoutingModule,
    DropFileModule
 
  ],
  declarations: [
    MessagesListComponent,
    ChatListComponent,
    MessagesComponent
  ],
  exports: [
    ChatListComponent
  ]
})
export class MessagesModule { }
