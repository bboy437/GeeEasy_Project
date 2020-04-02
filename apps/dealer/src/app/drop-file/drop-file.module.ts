import { NgModule } from "@angular/core";
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  imports: [
  ],
  declarations: [
    DragDropDirective
  ],
  exports: [
    DragDropDirective
  ]
})
export class DropFileModule {}
