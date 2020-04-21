import { Component, OnInit, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SaveListSupplierAPIService } from '@project/services';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-saved-lists',
  templateUrl: './saved-lists.component.html',
  styleUrls: ['./saved-lists.component.scss']

})
export class SavedListsComponent implements OnInit {

  arrSaveList: any = [];
  savedetail: any = [];
  loading = false;
  isReload = false;
  arrDelete: any = [];
  strTitle = '';
  distributor_lists_id: number;
  arrRename: any = [];
  filter: any = [];
  id: number;
  strname: string;

  private UrlRouter_Saves_Detail = "distributors/saved-detail";
  ColumnMode = ColumnMode;
  messages = {
    emptyMessage: `
        <div class="imglist">
            <img src="assets/images/loading.png" width="300"  >
        </div>
        <div class="labelList">
            <label >No data. Please select information in
                the list</label>
        </div>
    `
  }

  id_local: string;

  constructor(private route: Router,
    private saveListSupplierAPIService: SaveListSupplierAPIService,
    private dialogService: NbDialogService,
    iconsLibrary: NbIconLibraries,
    private router: Router, ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

  }


  ngOnInit() {
    this.loading = true;
    this.saveListSupplierAPIService.savelistSupplierSelectedAction$.subscribe(res => {
      if(res) {
        this.id = res.distributor_lists_id;
        this.savedetail = res.distributor_array;
        this.strTitle = res.distributor_lists_name;
        this.distributor_lists_id = res.distributor_lists_id;
        this.arrDelete.false = res.distributor_lists_id;
      }
    })
    this.getSaveList();
  }

  btnReload() {
    this.isReload = true;
    this.saveListSupplierAPIService.savelistSupplier$.subscribe(data => {
      this.arrSaveList = data;
      this.filter = data;
      console.log(this.arrSaveList);
      this.isReload = false;
    })
  }

  btnRefresh() {
    this.strname = "";
    this.filterlist('');

  }

  getSaveList() {
    this.saveListSupplierAPIService.savelistSupplier$.subscribe(data => {
      this.arrSaveList = data;
      this.filter = data;
      console.log(data);
      this.loading = false;
    })
  }

  btnClickItem(data: any) {
    console.log(data);
    this.loading = true;
    this.id = data.distributor_lists_id;
    this.saveListSupplierAPIService.selectedListSupplier(data)
    this.strTitle = data.distributor_lists_name;
    this.distributor_lists_id = data.distributor_lists_id;;
    this.savedetail = data.distributor_array;
    this.arrDelete.distributor_lists_id = data.distributor_lists_id;;
    this.loading = false;
  }

  btnDialogSavelists(data, isData) {
    console.log(data);
    this.arrDelete.distributor_id = data.distributor_id;

    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: this.arrDelete,
        isData: isData
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.btnReload();
        this.getSaveList();
        this.savedetail = [];
        this.strTitle = '';
      }
      // if (result) {
      //   this.saveListSupplierAPIService.deleteSaveListSup(JSON.stringify(result)).subscribe(res => {
      //   })
      // }
    });
  }

  btnRename(isData) {
    this.arrRename.distributor_lists_id = this.distributor_lists_id;
    this.arrRename.distributor_lists_name = this.strTitle;
    console.log('btnRename : isData : ', isData);

    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: this.arrRename,
        isData: isData
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.btnReload();
        this.getSaveList();
        this.savedetail = [];
        this.strTitle = '';
      }
    });
  }

  btnDelete(isData) {
    this.arrRename.distributor_lists_id = this.distributor_lists_id;
    this.arrRename.distributor_lists_name = this.strTitle;

    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: this.arrRename,
        isData: isData
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.btnReload();
        this.getSaveList();
        this.savedetail = [];
        this.strTitle = '';
      }
    });
  }

  filterlist(value: any) {
    this.arrSaveList = this.filter.filter(option =>
      option.distributor_lists_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);

    return this.arrSaveList.filter(option =>
      option.distributor_lists_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);
  }

  btnRowClick(row: any) {
    this.router.navigate([this.UrlRouter_Saves_Detail, row]);
  }

  btnRow(e) {
    // this.router.navigate([this.UrlRouter_Saves_Detail, row]);
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Saves_Detail, e.row.distributor_id]);
    }
  }

}
