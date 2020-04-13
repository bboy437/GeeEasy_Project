import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReusableReactiveFormService {

  constructor() { }

  validateAllFormFields = (formGroup: FormGroup): string[] => {
    let arrErrorFormCrl = [];
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        if (control.errors) {
          arrErrorFormCrl.push(field);
        }
      } else if (control instanceof FormGroup) {
        arrErrorFormCrl = [
          ...arrErrorFormCrl,
          ...this.validateAllFormFields(control)
        ];
      } else if (control instanceof FormArray) { }
    });
    return arrErrorFormCrl;
  }



}
