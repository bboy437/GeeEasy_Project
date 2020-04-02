import { Component, OnInit } from '@angular/core';
import { WarehouseAPIService, LocationAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DialogsMapComponent } from '../../../dialogs/dialogs-map/dialogs-map.component';

@Component({
  selector: 'project-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.scss']
})
export class StockCreateComponent implements OnInit {

  private UrlRouter_StockList = "products/stock/list";
  stockForm: FormGroup;
  RowID: string;
  submitted = false;
  arrobjRow: any = [];
  arrobjState: any = [];
  arrobjCity: any = [];
  arrobjTown: any = [];
  strZipcode: string;
  strState = "";
  strTown = "";
  strCity = "";
  isValidatorsstate: string;
  isValidatorsTown: string;
  isValidatorsCity: string;

  id_local: string;

  constructor(
    private warehouseAPIService: WarehouseAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private locationService: LocationAPIService,
    private dialogService: NbDialogService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  ngOnInit() {

    this.Builder();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      if (this.RowID !== "new") {
        this.getCountryNew();
      } else {
        const value = '9400412';
        this.warehouseAPIService.getWarehouseDetail(value).subscribe(data => {
          this.arrobjRow = data.response_data[0];
          console.log(this.arrobjRow);

          this.getStateEdit();

        })
      }
    }

  }

  Builder() {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      number: ['', Validators.required],
      zipcode: ['', Validators.required],
    });
  }

  get f() { return this.stockForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.stockForm.invalid) {
      return;
    }
  }

  // New ----------------------------------------------------------

  getCountryNew() {
    //getState
    const dataState = 'txt_location_type_id=' + 2 + '&txt_parent_id=' + 231 + '&cur_page=' + 1 + '&per_page=' + 100
    this.locationService.get(dataState).subscribe(data => {
      this.arrobjState = data.data.dataList;
    })
  }
  getStateNew(event: any) {
    this.isValidatorsstate = "";
    this.strCity = "";
    this.strTown = "";
    this.strZipcode = "";
    this.arrobjCity = null;
    this.arrobjTown = null;
    if (this.arrobjState.length > 0) {
      for (let i = 0; i < this.arrobjState.length; i++) {
        if (this.arrobjState[i].location_name === event) {
          const parentID = this.arrobjState[i].location_id;
          this.arrobjRow.warehouse_addr_province = this.arrobjState[i].location_name;
          //getCity
          const dataCity = 'txt_location_type_id=' + 3 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
          this.locationService.get(dataCity).subscribe(data => {
            this.arrobjCity = data.data.dataList;
          })
        }
      }
    }
  }
  getCityNew(event: any) {
    this.isValidatorsCity = "";
    this.strTown = "";
    this.strZipcode = "";
    this.arrobjTown = null;
    if (this.arrobjCity.length > 0) {
      for (let i = 0; i < this.arrobjCity.length; i++) {
        if (this.arrobjCity[i].location_name === event) {
          const parentID = this.arrobjCity[i].location_id;
          this.arrobjRow.warehouse_addr_amphoe = this.arrobjCity[i].location_name;
          //getCity
          const dataTown = 'txt_location_type_id=' + 4 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
          this.locationService.get(dataTown).subscribe(data => {
            this.arrobjTown = data.data.dataList;
            console.log(this.arrobjTown);
          })
        }
      }
    }
  }
  getTownNew(event: any) {
    this.isValidatorsTown = "";
    if (this.arrobjTown.length > 0) {
      for (let i = 0; i < this.arrobjTown.length; i++) {
        if (this.arrobjTown[i].location_name === event) {
          this.strZipcode = this.arrobjTown[i].location_postcode
          this.arrobjRow.warehouse_addr_tambon = this.arrobjTown[i].location_name;
          this.arrobjRow.warehouse_addr_post = this.arrobjTown[i].location_postcode
        }
      }
    }
  }


  //edit --------------------------------------------

  getStateEdit() {
    const dataState = 'txt_location_type_id=' + 2 + '&txt_parent_id=' + 231 + '&cur_page=' + 1 + '&per_page=' + 100
    this.locationService.get(dataState).subscribe(data => {
      this.arrobjState = data.data.dataList;
      this.strState = this.arrobjRow.warehouse_addr_province;
      console.log(this.strState, this.strState);

      this.getCityEdit(this.arrobjRow.warehouse_addr_province, this.arrobjState);
    })

  }
  getCityEdit(str: string, arrstate: any) {
    const strs = str;
    const arrstates = arrstate;
    if (arrstates.length > 0) {
      for (let i = 0; i < arrstates.length; i++) {
        if (arrstates[i].location_name === strs) {
          const parentID = arrstates[i].location_id;
          //getCity
          const dataCity = 'txt_location_type_id=' + 3 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
          this.locationService.get(dataCity).subscribe(data => {
            this.arrobjCity = data.data.dataList;
            this.strCity = this.arrobjRow.warehouse_addr_amphoe;
            this.getTownEdit(this.arrobjRow.warehouse_addr_amphoe, this.arrobjCity);
          })
        }
      }
    }
  }

  getTownEdit(str: string, arrcity: any) {
    const strs = str;
    const arrcitys = arrcity;
    if (arrcitys.length > 0) {
      for (let i = 0; i < arrcitys.length; i++) {
        if (arrcitys[i].location_name === strs) {
          const parentID = arrcitys[i].location_id;

          //  this.arrobjRow.supplier_addr_post = arrcitys[i].location_name;
          //getTown
          const dataTown = 'txt_location_type_id=' + 4 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
          this.locationService.get(dataTown).subscribe(data => {
            this.arrobjTown = data.data.dataList;
            this.strTown = this.arrobjRow.warehouse_addr_tambon;
            this.strZipcode = this.arrobjRow.warehouse_addr_post;
            this.getSave();
          })
        }
      }
    }
  }
  //--------------------------------------------
  getSave() {
    this.arrobjRow.warehouse_addr_tambon = this.strTown;
    this.arrobjRow.warehouse_addr_amphoe = this.strCity;
    this.arrobjRow.warehouse_addr_province = this.strState;
    this.arrobjRow.warehouse_addr_post = this.strZipcode;
  }


  btnSaveClick() {
    if (this.strState === '') {
      this.isValidatorsstate = "no"
    }
    if (this.strCity === '') {
      this.isValidatorsCity = "no"
    }
    if (this.strTown === '') {
      this.isValidatorsTown = "no"
    }

    this.submitted = true;
    if (this.stockForm.invalid) {
      return;
    }
    this.save();

  }

  save() {
    const dataJson = {
      "distributor_id": this.id_local,
      "warehouse_type_id": 2,
      "name": this.arrobjRow.warehouse_name,
      "mobile": this.arrobjRow.warehouse_mobile,
      "addr_number": this.arrobjRow.warehouse_addr_number,
      "addr_tambon": this.strTown,
      "addr_amphoe": this.strCity,
      "addr_province": this.strState,
      "addr_post": this.strZipcode,

    }
    if (this.RowID !== "new") {
      this.warehouseAPIService.addWarehouse(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.router.navigate([this.UrlRouter_StockList]);
      })
    } else {
      this.warehouseAPIService.updateWarehouse(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.router.navigate([this.UrlRouter_StockList]);
      })
    }

  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_StockList]);
  }


  btnDialogMab() {

    const dialogRef = this.dialogService.open(DialogsMapComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {

        this.isValidatorsstate = "";
        this.isValidatorsTown = "";
        this.isValidatorsCity = "";
        this.strCity = "";
        this.strTown = "";
        this.strZipcode = "";
        // this.arrobjRow.supplier_addr_full = "";
        this.arrobjRow.warehouse_addr_number = "";
        this.arrobjCity = null;
        this.arrobjTown = null;

        // this.arrobjRow.supplier_addr_full = result.address;
        this.arrobjRow.warehouse_addr_number = result.num;
        this.arrobjRow.warehouse_addr_tambon = result.town;
        this.arrobjRow.warehouse_addr_amphoe = result.city;
        this.arrobjRow.addr_province = result.state;
        this.arrobjRow.warehouse_addr_post = result.zipcode;
        this.getStateEdit();

      }

    });
  }


}
