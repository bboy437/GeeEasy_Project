import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[libOnlyUnit]"
})
export class OnlyUnit {
  regexStr = "^[\u0E00-\u0E7Fa-zA-Z \.\-]*$";
  @Input() isAlphaNumeric: boolean;

  constructor(private el: ElementRef) { }

  @HostListener("keypress", ["$event"]) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value
        .replace(/[^\u0E00-\u0E7Fa-zA-Z \.\-]/g, "")
      event.preventDefault();
    }, 100);
  }
}
