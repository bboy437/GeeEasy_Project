import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#ffffff'
  @HostBinding('style.opacity') private opacity = '1'
  @HostBinding('style.border') private border = ''


  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '1'
    this.border = '2px dashed #1c8adb'

  }
  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#f5fcff'
    this.background = '#ffffff'
    this.opacity = '1'
    this.border = ''
  }
  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {

    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#f5fcff'
    this.background = '#ffffff'
    this.opacity = '1'
    this.border = ''
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }

  }

}
