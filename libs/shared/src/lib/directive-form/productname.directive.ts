import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: "[libOnlyProductName]"
})
export class OnlyProductName {
    regexStr = "^[\u0E00-\u0E7Fa-zA-Z_0-9 \(\)\&\.\-]*$";
    @Input() isAlphaNumeric: boolean;

    constructor(private el: ElementRef) { }

    @HostListener("keypress", ["$event"]) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event) {
        console.log(event);
        console.log(this.el.nativeElement.value);
        console.log(new RegExp(this.regexStr).test(this.el.nativeElement.value));

        setTimeout(() => {
            this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^\u0E00-\u0E7Fa-zA-Z_0-9 \.\-\(\)\&]/g, "")
            event.preventDefault();
        }, 0);
    }
}
