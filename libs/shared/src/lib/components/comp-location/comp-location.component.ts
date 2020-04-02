import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';

// file service & external data
import JSON_PROVINCE from '../../json/province.json';
import JSON_LOCATION from '../../json/location.json';
import JSON_LOCATION_DETAIL from '../../json/location_detail.json';
import { MapsComponent } from '../../dialogs/maps/maps.component.js';

// export interface Location {
//   location_id: number;
//   location_type_id: number;
//   parent_id: number;
//   postcode: string;
//   location_name: string;
//   location_postcode: number;
//   location_geo_id: number;
//   old_id: number;
// }

// export interface LocationDetail {
//   location_detail_id: number;
//   location_id: number;
//   lang_Id: number;
//   name: string;
//   create_time: number;
//   update_time: number;
// }


@Component({
  selector: 'project-comp-location',
  templateUrl: './comp-location.component.html',
  styleUrls: ['./comp-location.component.scss']
})

export class CompLocationComponent implements OnInit {

  @Input() status: string;
  @Output() dataLocation = new EventEmitter<any>();

  arrobjRow: any = [];
  arrProvince: any[] = JSON_PROVINCE;
  arrAmphoe: any[];
  arrTambon: any[];
  arrLocation: any[] = JSON_LOCATION;
  arrLocationDetail: any[] = JSON_LOCATION_DETAIL;

  Form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
  ) {
  }

  ngOnInit() {
    console.log('status', this.status);
    this.dataLocation.emit(true)
    this.Builder();
    if (this.status == 'new') {

    } else {

    }
  }

  Builder() {
    this.Form = this.fb.group({
      addressFull: ['', Validators.required],
      addressNo: ['', Validators.required],
      province: ['', Validators.required],
      amphoe: ['', Validators.required],
      tambon: ['', Validators.required],
      zipcode: ['', Validators.required],
      location_lat: [],
      location_lng: [],
      location_lat_location_lng: [{ value: '', disabled: true }, Validators.required],
    });
  }

  editForm() {
    this.Form.patchValue({
      addressFull: this.arrobjRow.warehouse_addr_address_full,
      addressNo: this.arrobjRow.warehouse_addr_number,
      province: this.arrobjRow.warehouse_addr_province,
      amphoe: this.arrobjRow.warehouse_addr_amphoe,
      tambon: this.arrobjRow.warehouse_addr_tambon,
      zipcode: this.arrobjRow.warehouse_addr_post,
      location_lat: this.arrobjRow.warehouse_lat,
      location_lng: this.arrobjRow.warehouse_lng,
      location_lat_location_lng: this.arrobjRow.warehouse_lat + ',' + this.arrobjRow.warehouse_lng,
    });
  }


  get f() { return this.Form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }

  // New ----------------------------------------------------------

  changeProvince(location_name) {

    setTimeout(() => {
      this.Form.get('amphoe').patchValue("");
      this.Form.get('tambon').patchValue("");
      this.Form.get('zipcode').patchValue("");
      this.Form.get('location_lat').patchValue(0);
      this.Form.get('location_lng').patchValue(0);
      this.Form.get('location_lat_location_lng').patchValue(0 + ',' + 0);
    }, 0);
    this.arrAmphoe = null;
    this.arrTambon = null;
    if (this.arrProvince.length > 0) {
      for (let i = 0; i < this.arrProvince.length; i++) {
        if (this.arrProvince[i].location_name === location_name) {
          const location_id = Number(this.arrProvince[i].location_id);
          this.get_Amphoe(location_id);
        }
      }
    }
  }

  async get_Amphoe(location_id) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id === id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
        const detail_data_array = get_detail_by_id(row.location_id);
        row.location_name = detail_data_array[0].name;
        row.location_postcode = Number(row.postcode);

        newArray.push({
          location_id: row.location_id,
          location_name: detail_data_array[0].name,
          location_postcode: Number(row.postcode)
        });

        return true;
      }
      return false;
    });

    this.arrAmphoe = newArray;

    console.log("get_Amphoe : arrAmphoe", this.arrAmphoe);
  }

  changeAmphoe(location_name) {
    setTimeout(() => {
      this.Form.get('tambon').patchValue("");
      this.Form.get('zipcode').patchValue("");
    }, 0);
    this.arrTambon = null;
    if (this.arrAmphoe.length > 0) {
      for (let i = 0; i < this.arrAmphoe.length; i++) {
        if (this.arrAmphoe[i].location_name === location_name) {
          const location_id = Number(this.arrAmphoe[i].location_id);
          this.get_Tambon(location_id);
        }
      }
    }
  }

  async get_Tambon(location_id) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id === id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
        const detail_data_array = get_detail_by_id(row.location_id);
        row.location_name = detail_data_array[0].name;
        row.location_postcode = Number(row.postcode);

        newArray.push({
          location_id: row.location_id,
          location_name: detail_data_array[0].name,
          location_postcode: Number(row.postcode)
        });

        return true;
      }
      return false;
    });

    this.arrTambon = newArray;
    console.log("arrTambon", this.arrTambon);
  }

  changeTambon(location_name) {
    if (this.arrTambon.length > 0) {
      for (let i = 0; i < this.arrTambon.length; i++) {
        if (this.arrTambon[i].location_name === location_name) {
          setTimeout(() => {
            this.Form.get('tambon').patchValue(this.arrTambon[i].location_name);
            this.Form.get('zipcode').patchValue(this.arrTambon[i].location_postcode);
          }, 0);
        }
      }
    }
  }

  /*Edit Data ------------------------ */

  /*Change Province Edit */
  async changeProvinceEdit(strProvince, strAmphoe, strTambon) {
    const thisLocation = await this.arrProvince.filter(row => {
      if (row.location_name.indexOf(strProvince) !== -1) {
        return true;
      }
      return false;
    });
    if (thisLocation.length > 0) {
      this.get_Amphoe_Edit(thisLocation[0].location_id, strAmphoe, strTambon);
    }

  }

  /*Get Amphoe Edit */
  async get_Amphoe_Edit(location_id, strAmphoe, strTambon) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id == id) {
          return true;
        }
        return false;
      });
    };
    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
        const detail_data_array = get_detail_by_id(row.location_id);
        row.location_name = detail_data_array[0].name;
        row.location_postcode = Number(row.postcode);

        newArray.push({
          location_id: row.location_id,
          location_name: detail_data_array[0].name,
          location_postcode: Number(row.postcode)
        });

        return true;
      }
      return false;
    });

    this.arrAmphoe = newArray;
    this.changeAmphoeEdit(strAmphoe, strTambon);

  }

  /*Change Amphoe Edit */
  async changeAmphoeEdit(strAmphoe, strTambon) {

    const thisLocation = await this.arrAmphoe.filter(row => {
      if (row.location_name.indexOf(strAmphoe) !== -1) {
        return true;
      }
      return false;
    });
    if (thisLocation.length > 0) {
      this.get_Tambon_Edit(thisLocation[0].location_id, strTambon)
    }


  }

  /*Get Tambon Edit */
  async get_Tambon_Edit(location_id, strTambon) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id == id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
        const detail_data_array = get_detail_by_id(row.location_id);
        row.location_name = detail_data_array[0].name;
        row.location_postcode = Number(row.postcode);

        newArray.push({
          location_id: row.location_id,
          location_name: detail_data_array[0].name,
          location_postcode: Number(row.postcode)
        });

        return true;
      }
      return false;
    });

    this.arrTambon = newArray;
    this.changeTambonEdit(strTambon);

  }

  /*Change Tambon Edit */
  changeTambonEdit(strTambon) {
    if (this.arrTambon.length > 0) {
      for (let i = 0; i < this.arrTambon.length; i++) {
        if (this.arrTambon[i].location_name === strTambon) {
          setTimeout(() => {
            this.Form.get('tambon').patchValue(this.arrTambon[i].location_name);
            this.Form.get('zipcode').patchValue(this.arrTambon[i].location_postcode);
          }, 0);
        }
      }
    }
  }

  //--------------------------------------------



  btnDialogMab() {
    this.btnClickItem();

    const dialogRef = this.dialogService.open(MapsComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
        console.log(result);

        setTimeout(() => {
          this.Form.get('addressFull').patchValue(result.address);
          this.Form.get('addressNo').patchValue(result.num);
          this.Form.get('province').patchValue(result.state);
          this.Form.get('amphoe').patchValue(result.city);
          this.Form.get('tambon').patchValue(result.town);
          this.Form.get('zipcode').patchValue(result.zipcode);
          this.Form.get('location_lat').patchValue(result.supplier_addr_location_lat);
          this.Form.get('location_lng').patchValue(result.supplier_addr_location_lng);
          this.Form.get('location_lat_location_lng').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
        }, 0);

        this.changeProvinceEdit(result.state, result.city, result.town);

      }
    });
  }


  btnClickItem() {
    this.dataLocation.emit(true)
  }

  public handleClick(event: MouseEvent) {
    this.dataLocation.emit(event);
  }

  @HostListener('drop', ['$event']) public ondrop(evt) {

    console.log('evt', evt)
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.dataLocation.emit(true)
    }

  }

}
