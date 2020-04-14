import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductAPIService } from '@project/services';

@Component({
  selector: 'project-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() label: string;
  @Input() control: FormControl;
  @Input() inputType: string;
  @Input() controlType = 'input';
  @Input() mask: string;
  @Input() thousandSeparator: string;
  @Input() libOnly: string;

  //style
  @Input() typeStyle: string;
  @Input() nameStyle: string;
  @Input() textAlign: string;

  //name validate
  @Input() requiredName: string;
  @Input() emailName: string;

  constructor(private productAPIService: ProductAPIService) {
  }

  ngOnInit() {
  }

  showErrors() {
    const { dirty, touched, errors } = this.control
    return dirty && touched && errors
  }

}
