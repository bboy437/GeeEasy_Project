import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BrowseSupplierAPIService, DistributorAPIService } from '@project/services';

@Component({
  selector: 'project-comp-category-browse',
  templateUrl: './comp-category.component.html',
  styleUrls: ['./comp-category.component.scss']
})
export class CompCategoryBrowseComponent implements OnInit {
  @Output() categoryID = new EventEmitter<any>();
  @Input() status: string;
  @Input() map: string;

  arrCategory: any = [];
  filter: any = [];
  lastArray: any = [];
  thisArray: any = [];
  lastCount = 0; lastId = 0; lastPId = 0;
  lastName: any = [];
  numID: number;
  numRootID: number;
  strName: string;
  strFillter: string;
  loading = false;
  strLoading: string;

  constructor(
    private browseSupplierAPIService: BrowseSupplierAPIService,
  ) {
  }

  ngOnInit() {
    this.lastName[this.lastCount] = "View All";

    if (this.status === 'Dealer') {
      this.strLoading = 'success';
    }
    if (this.status === 'Distributor') {
      this.strLoading = 'primary';
    }

    if (this.status === 'Supplier') {
      this.strLoading = 'warning';
    }


    this.get_category_start(res => {
      this.lastName[this.lastCount] = "View All";
      this.numID = 0;
      this.strName = "none";
      this.browseSupplierAPIService.selectBrowseCategory$.subscribe(data => {
    
        if (data) {
          this.categoryID.emit(data);
          this.lastName[this.lastCount] = data.name;
          this.numID = data.product_category__id
        }

      })
      // const ID = {
      //   product_category__id: 0,
      //   product_category_root_id: 0,
      // }
      // this.categoryID.emit(ID);
    })
  }



  get_category_start(callback) {
    this.loading = true;
    if (this.status === 'Distributor') {
      const valueCategory = 'cur_page=' + 1 + '&per_page=' + 100;
      this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
        this.thisArray = data.response_data;
        this.filter = this.thisArray;
        if (this.thisArray.length !== 0) {
          this.thisArray.forEach(element => {
            element.isActive = false;
          });
          callback(this.thisArray);
        } else {
          callback([]);
        }
        this.loading = false;
        console.log(this.thisArray);
      })
    }
    if (this.status === 'Supplier' || this.status === 'Dealer') {
      const valueCategory = 'cur_page=' + 1 + '&per_page=' + 100;
      this.browseSupplierAPIService.getCategoryDist(valueCategory).subscribe(data => {
        this.thisArray = data.response_data;
        this.filter = this.thisArray;
        if (this.thisArray.length !== 0) {
          this.thisArray.forEach(element => {
            element.isActive = false;
          });
          callback(this.thisArray);
        } else {
          callback([]);
        }
        this.loading = false;
        console.log(this.thisArray);
      })
    }

  }

  get_category_view(event, name) {
    console.log("event ", event, name);

    this.view_isActive(callback => { })

    const id = event.product_category_id;
    const child = event.product_category_total_child;

    if (child > 0) {
      // fetch new data
      this.lastCount++;
      this.lastName[this.lastCount] = name;
      this.strName = name;
      console.log('name', this.lastName[this.lastCount]);
      // save last data
      this.lastArray = this.thisArray;
      console.log('lastArray', this.lastArray);

      this.view_id(id, dataLists => {
        this.thisArray = dataLists;
        this.filter = this.thisArray;
        console.log(this.lastCount, this.thisArray);
      });

    } else {
      this.lastName[this.lastCount] = name;
      this.strName = name;
      event.isActive = true;
    }

    this.numID = id;
    if (this.lastCount === 0) {
      console.log('a');
      this.numRootID = id
    }

    const ID = {
      product_category__id: this.numID,
      product_category_root_id: this.numRootID,
      name: this.lastName[this.lastCount]
    }
    console.log("ID", ID);
    this.browseSupplierAPIService.dataSelectBrowseCategory(ID)
    this.categoryID.emit(ID)
    
  }

  view_isActive(callback) {
    if (this.thisArray.length !== 0) {
      this.thisArray.forEach(element => {
        element.isActive = false;
      });
      this.filter = this.thisArray;
      callback(this.thisArray);
    } else {
      callback([]);
    }
  }

  view_id(id, callback) {
    this.loading = true;
    if (this.status === 'Distributor') {
      const valueCategory = 'cur_page=' + 1 + '&per_page=' + 100 + '&product_category_id=' + id
      this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
        if (data.response_data.length !== 0) {
          data.response_data.forEach(element => {
            element.isActive = false;
          });
          callback(data.response_data);
        } else {
          callback([]);
        }
        this.loading = false;
      })
    }
    if (this.status === 'Supplier' || this.status === 'Dealer') {
      const valueCategory = 'cur_page=' + 1 + '&per_page=' + 100 + '&product_category_id=' + id
      this.browseSupplierAPIService.getCategoryDist(valueCategory).subscribe(data => {
        if (data.response_data.length !== 0) {
          data.response_data.forEach(element => {
            element.isActive = false;
          });
          callback(data.response_data);
        } else {
          callback([]);
        }
        this.loading = false;
      })
    }

  }


  onPressBack() {

    this.view_isActive(callback => { })
    if (this.lastArray.length <= 0 || this.lastCount <= 0) {

      this.get_category_start(data_lists => {
        // code
        this.lastArray = [];
        this.lastName[this.lastCount] = "View All";
        this.numID = null;

        const ID = {
          product_category__id: 0,
          product_category_root_id: 0,
          name: this.lastName[this.lastCount]
        }
        this.categoryID.emit(ID)
        this.browseSupplierAPIService.dataSelectBrowseCategory(ID)

      });
    } else {

      const currentItem = this.lastArray[0];
      let _id = currentItem.product_category_parent_id;

      // fetch new data
      this.lastCount--;

      if (this.lastCount <= 0) {
        _id = 0;
        this.lastArray = [];
        this.lastName[this.lastCount] = "View All";
        this.strName = 'none';
      } else {
        this.strName = this.lastName[this.lastCount];
      }

      // save last data
      // lastArray = thisArray;
      this.numID = _id;
      console.log("view ", _id);
      console.log("name ", this.lastName[this.lastCount]);

      this.view_id(_id, dataLists => {
        this.thisArray = dataLists;
        this.filter = this.thisArray;
        console.log(this.lastCount, this.thisArray);

      });
    }

    console.log('lastCount', this.lastCount);
    if (this.lastCount === 0) {
      console.log('a');
      this.numRootID = this.numID
    }

    const ID = {
      product_category__id: this.numID,
      product_category_root_id: this.numRootID,
      name: this.lastName[this.lastCount]
    }
    this.categoryID.emit(ID)
    this.browseSupplierAPIService.dataSelectBrowseCategory(ID)

  }


  refreshCate() {
    this.strFillter = "";
    this.filterCategoryName("");
  }

  btnReload() {
    this.get_category_start(res => {
      this.lastName[this.lastCount] = "View All";
      this.numID = 0;
      this.strName = "none";
      const ID = {
        product_category__id: 0,
        product_category_root_id: 0,
        name: this.lastName[this.lastCount]
      }
      this.categoryID.emit(ID);
      this.browseSupplierAPIService.dataSelectBrowseCategory(ID)
    })
  }


  filterCategoryName(value: any) {
    this.thisArray = this.filter.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1);

  }


}



