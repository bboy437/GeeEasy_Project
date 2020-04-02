import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { FileManagerComponent } from './filemanager.component';
import { FileManagerListComponent } from './file-manager-list/file-manager-list.component';




const routes: Routes = [
  {
    path: "",
    component: FileManagerComponent,
    children: [
      {
        path: "list",
        component: FileManagerListComponent
      },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagerRoutingModule {}
