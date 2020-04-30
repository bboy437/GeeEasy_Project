import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'project-ngx-select',
  templateUrl: './ngx-select.component.html',
  styleUrls: ['./ngx-select.component.scss']
})
export class NgxSelectComponent implements OnInit {

  //input
  @Input() label: string;
  @Input() control: FormControl;
  @Input() inputType: string;
  @Input() controlType = 'input';
  @Input() items: any;
  @Input() optionValueField: string;
  @Input() optionTextField: string;
  @Input() placeholder: string;

  //name validate
  @Input() requiredName: string;
  @Input() emailName: string;

  //Output
  @Output() valueChange = new EventEmitter();
  @Output() selectionChanges = new EventEmitter();

  //Error validate
  @Input() forceShowErrors = false;

  constructor() { }

  ngOnInit() {
  }

  showErrors() {
    const { dirty, touched, errors } = this.control
    return (errors && this.forceShowErrors) || (dirty && touched && errors)
  }

  valueChanged(data) {
    // const value = {
    //   location_name: data,
    //   name: this.requiredName
    // }
    this.valueChange.emit(data);
  }

  selectionChanged(data) {
    this.selectionChanges.emit(data);
  }

}
