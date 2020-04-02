import { ElementRef, HostListener, Directive } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[decimal-mask]'
  }
)
export class DecimalMask {
  constructor(private el: ElementRef, public model: NgControl) {}

  @HostListener('input',['$event']) onEvent($event){
    console.log("keypress: " + $event.keypress);
    var valArray = this.el.nativeElement.value.split('.') ;
    for(var i = 0; i < valArray.length; ++i) {
      valArray[i] = valArray[i].replace(/\D/g, '');
    }

    let newVal = "";

    if(valArray.length === 0) {
      newVal = "";
    }
    else {
      let matches = valArray[0].match(/[0-9]{3}/mig);

      if(matches !== null && valArray[0].length > 3) {
        let commaGroups = Array.from(Array.from(valArray[0]).reverse().join('').match(/[0-9]{3}/mig).join()).reverse().join('');
        let replacement = valArray[0].replace(commaGroups.replace(/\D/g, ''), '');

        newVal = (replacement.length > 0 ? replacement + "," : "") + commaGroups;
      } else {
        newVal = valArray[0];
      }
      
      if(valArray.length > 1) {
        newVal += "." + valArray[1].substring(0,2);
      }
    }
    
    console.log('newVal',newVal);
    // set the new value
    this.model.control.setValue(newVal);
    //this.model.valueAccessor.writeValue(newVal);
  }
}