import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'project-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  
  @Input() label: string;
  @Input() control: FormControl;
  @Input() rows: string;


  //style
  @Input() typeStyle: string;
  @Input() nameStyle: string;
  @Input() textAlign: string;

  //name validate
  @Input() requiredName: string;
  @Input() emailName: string;

  constructor() {
  }

  ngOnInit() {
  }

  showErrors() {
    const { dirty, touched, errors } = this.control
    return dirty && touched && errors
  }

}
