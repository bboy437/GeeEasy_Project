import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[libOnlyCharacter]"
})
export class OnlyCharacterDirective {
  regexStr = "^[\u0E00-\u0E7Fa-zA-Z_ ]*$";
  @Input() isAlphaNumeric: boolean;

  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value
        .replace(/[^\u0E00-\u0E7Fa-zA-Z_ ]/g, "")
        .replace(/\s/g, "");
      event.preventDefault();
    }, 100);
  }
}
