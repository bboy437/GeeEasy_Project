import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MessagesComponent } from './messages.component';
import { MessagesListComponent } from './messages-list/messages-list.component';



const routes: Routes = [
  {
    path: "",
    component: MessagesComponent,
    children: [
      {
        path: "list",
        component: MessagesListComponent
      },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {}
