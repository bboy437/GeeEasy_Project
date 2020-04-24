import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'project-aleart',
  templateUrl: './aleart.component.html',
  styleUrls: ['./aleart.component.scss']
})
export class AleartComponent implements OnInit {
  @Input() status: any;
  @Input() data: any;
  evaIcons = [];
  Form: FormGroup;

  constructor(
    protected ref: NbDialogRef<AleartComponent>,
    iconsLibrary: NbIconLibraries,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    if (this.status === 'Product QtyMinimum')
      this.buildForm();
      this.detailForm();
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      wholesale: this.formBuilder.array([])
    });
  }

  detailForm(){
    this.data.forEach(element => {
      this.wholesale.push(
        this.formBuilder.group(element)
      );
    });
    this.wholesale.disable();
    console.log(this.wholesale.value);
    

  }

  get wholesale(): FormArray {
    return this.Form.get('wholesale') as FormArray;
  }


  btnCancelClick() {
    this.ref.close('cancel');
  }

  btnOkClick() {
    this.ref.close('ok');
  }

}
