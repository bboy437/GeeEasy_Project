import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MessagesComponent } from './messages.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { ChatListComponent } from './chat-list/chat-list.component';



const routes: Routes = [
  {
    path: "",
    component: MessagesComponent,
    children: [
      {
        path: "list",
        component: MessagesListComponent
      },
      {
        path: "chat/:id/:name",
        component: ChatListComponent,
      },
      // {
      //   path: "chat",
      //   component: ChatListComponent,
      //   outlet: 'popup'
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {}
