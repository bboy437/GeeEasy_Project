import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'project-input-mobile-phone',
  templateUrl: './input-mobile-phone.component.html',
  styleUrls: ['./input-mobile-phone.component.scss']
})
export class InputMobilePhoneComponent implements OnInit {


  @Input() label: string;
  @Input() control: FormControl;
  @Input() inputType: string;
  @Input() data: string;


  //name validate
  @Input() requiredName: string;
  @Input() emailName: string;

  //Error validate
  @Input() forceShowErrors = false;

  //theme
  @Input() theme = "white";

  //Output
  @Output() valueChange = new EventEmitter();


  phone: any = {
    mobile: {
      input: "",
      number: "",
      number_array: []
    },
  }

  showErrorTel = true;

  constructor() {
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data)
      this.phoneNumber().main(_self_ => {
        _self_.getNumberArray(this.data, getNumberArray => {
          this.phone.mobile.number = this.data;
          this.phone.mobile.number_array = getNumberArray;
        });
      });
    this.valueChanged(this.phone)
  }

  showErrors() {
    const { dirty, touched, errors } = this.control
    return (errors && this.forceShowErrors) || (dirty && touched && errors)
  }

  inArrayPhone(_min_, _max_, _event_, _phone_) {
    this.phoneNumber().main(_self_ => {
      _phone_.input = _event_.target.value;
      _self_.checkLength(_min_, _max_, _event_.target.value.length, checkLength => {
        if (checkLength) {
          _self_.checkIncludes(_phone_.number, _event_.target.value, checkIncludes => {
            _self_.newNumber(checkIncludes, _phone_.number, _event_.target.value, newNumber => {
              _phone_.number = _phone_.number.concat(newNumber);
              _self_.getNumberArray(_phone_.number, getNumberArray => {
                _phone_.number_array = getNumberArray;
                _event_.target.value = "";
              });
            });
          });
        }
      });
    });
    this.valueChanged(this.phone)
  }

  phoneNumber() {
    let function_phone = {
      consoleLog(_function_, _title_, _data_) {
        let _self_ = this;
      },
      checkLength(_min_length_, _max_length_, _phone_, callback: (res) => any) {
        let _self_ = this;
        const res = ((_min_length_ <= _phone_) && (_phone_ <= _max_length_ || _phone_ > _max_length_));
        callback(res);
      },
      checkIncludes(_phone_, _new_phone_, callback: (res) => any) {
        let _self_ = this;
        const res = _phone_.includes(_new_phone_);
        callback(res);
      },
      newNumber(checkLength, _phone_, _new_phone_, callback: (res) => any) {
        let _self_ = this;
        const res = (!checkLength) ? (_phone_ != "") ? ",".concat(_new_phone_) : _new_phone_ : "";
        callback(res)
      },
      getNumberArray(_phone_, callback: (res) => any) {
    
        let _self_ = this;
        const res = (_phone_ !== '') ? _phone_.split(",") : "";
        callback(res)
      },
      removeNumberIndex(index, _phone_array_, callback: (res) => any) {
        let _self_ = this;
        const res = _phone_array_.splice(index, 1);
        callback(res)
      },
      getNumber(_phone_array_, callback: (res) => any) {
        let _self_ = this;
        let res = "";
        _phone_array_.forEach(item => {
          _self_.newNumber(false, res, item, newNumber => {
            res = res.concat(newNumber);
          });
        });
        callback(res)
      },
      replaceString(_replace_, _new_replace_, _phone_, callback: (res) => any) {
        let _self_ = this;
        let res = _phone_.replace(_replace_, _new_replace_);
        callback(res);
      },
      matchString(_match_, _phone_, callback: (res) => any) {
        let _self_ = this;
        let res = (_phone_.match(_match_)) ? true : false;
        callback(res);
      },
      main(callback: (res) => any) {
        let _self_ = this;
        callback(_self_);
      }
    }
    return function_phone;
  }

  removePhoneNumberIndex(index, _phone_) {
    this.phoneNumber().main(_self_ => {
      _self_.removeNumberIndex(index, _phone_.number_array, removeNumberIndex => {
        _self_.getNumber(_phone_.number_array, getNumber => {
          _phone_.number = getNumber;
        });
      });
    });
    this.valueChanged(this.phone)
  }

  valueChanged(data) {
    this.valueChange.emit(data);
  }



}
