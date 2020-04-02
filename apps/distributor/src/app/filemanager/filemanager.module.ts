import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NebularModule } from "@project/nebular";
import { ThemeModule } from "@project/theme";
import { FileManagerListComponent } from "./file-manager-list/file-manager-list.component";
import { FileManagerRoutingModule } from "./filemanager-routing.module";
import { FileManagerComponent } from "./filemanager.component";
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
  declarations: [FileManagerListComponent, FileManagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    FileManagerRoutingModule,
    LayoutsModule
  ]
})
export class FileManagerModule {}
