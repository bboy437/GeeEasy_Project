import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductAPIService } from '@project/services';

@Component({
  selector: 'project-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() arrSelect: any;
  @Input() name: string;
  @Input() value: string;
  @Input() label: string;
  @Input() control: FormControl;
  @Input() placeholder: string;

  //name validate
  @Input() requiredName: string;
  @Input() emailName: string;

  //Output
  @Output() selectedChange = new EventEmitter();

  constructor(private productAPIService: ProductAPIService) {
  }

  ngOnInit() {
    console.log(this.arrSelect);
    console.log(this.name);
    console.log(this.value);
  }

  showErrors() {
    const { dirty, touched, errors } = this.control
    return dirty && touched && errors
  }

  selectionChanged(data) {
    console.log(data); 
    this.selectedChange.emit(data);
  }

}
