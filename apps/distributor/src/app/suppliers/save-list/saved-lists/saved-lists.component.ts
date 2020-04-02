import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy
} from "@angular/core";
import { Router } from "@angular/router";
import { SaveListSupplierAPIService } from "@project/services";
import { SaveListTableService } from "./table-list.service";
import { NgbdSortableHeader, SortEvent } from "@project/services";
import { Observable } from "rxjs";
import { ISaveList, SupplierSavelist } from "@project/interfaces";
import { DecimalPipe } from "@angular/common";
import { NbDialogService, NbIconLibraries } from "@nebular/theme";
import { DialogsSavedListComponent } from "../../../dialogs/dialogs-saved-list/dialogs-saved-list.component";
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: "project-saved-lists",
  templateUrl: "./saved-lists.component.html",
  styleUrls: ["./saved-lists.component.scss"],
  providers: [SaveListTableService, DecimalPipe]
})
export class SavedListsComponent implements OnInit {
  arrSaveList: any = [];
  savedetail: any = [];
  savelist$: Observable<ISaveList[]>;
  tatallist$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  arrDelete: any = [];
  strTitle = "";
  supplier_lists_id: number;
  arrRename: any = [];
  filter: any = [];
  private UrlRouter_Saves_Detail = "suppliers/saved-detail";
  strFilter: string;
  id: string;
  loading = false;
  isReload = false;

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

  constructor(
    private route: Router,
    private saveListSupplierAPIService: SaveListSupplierAPIService,
    public service: SaveListTableService,
    private dialogService: NbDialogService,
    iconsLibrary: NbIconLibraries,
    private router: Router
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
    iconsLibrary.registerFontPack("ion", { iconClassPrefix: "ion" });
  }

  ngOnInit() {
    // this.getProductGroup();
    this.callApi(e => {
      // completed
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.savelist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.savelist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.isReload = false;
    });
  }

  getSaveList() {
    const value =
      "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + this.id_local;
    this.saveListSupplierAPIService.getSaveList(value).subscribe(data => {
      this.arrSaveList = data.response_data;
      this.filter = data.response_data;
    });
  }

  btnClickItem(data: any, listID, title, supplier_lists_id) {
    this.loading = true;
    this.id = listID;
    console.log(data);
    this.strTitle = title;
    this.supplier_lists_id = supplier_lists_id;
    this.savedetail = data;
    this.arrDelete.false = listID;
    this.loading = false;
  }

  formatTableTd(title: string, rowspan: string, colspan: string) {
    const td = {
      title: title,
      rowspan: rowspan,
      colspan: colspan
    }
    return td;
  }

  btnDialogSavelists(data, isData) {
    console.log(data, isData);

    this.arrDelete.supplier_id = data.supplier_id;
    this.arrDelete.supplier_lists_id = this.supplier_lists_id;
    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: this.arrDelete,
        isData: isData
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === "ok") {
        this.getSaveList();
        this.btnReload();
        this.savedetail = [];
        this.strTitle = "";
        this.id = '';
      }
    });
  }

  btnRename(isData) {
    this.arrRename.supplier_lists_id = this.supplier_lists_id;
    this.arrRename.supplier_lists_name = this.strTitle;

    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: this.arrRename,
        isData: isData
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === "ok") {
        this.getSaveList();
        this.btnReload();
        this.savedetail = [];
        this.strTitle = "";
        this.id = '';
      }
    });
  }

  btnDelete(isData) {
    this.arrRename.supplier_lists_id = this.supplier_lists_id;
    this.arrRename.supplier_lists_name = this.strTitle;

    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: this.arrRename,
        isData: isData
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === "ok") {
        this.getSaveList();
        this.btnReload();
        this.savedetail = [];
        this.strTitle = "";
        this.id = '';
      }
    });
  }

  filterlist(value: any) {
    this.arrSaveList = this.filter
      .filter(
        option =>
          option.supplier_lists_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
      )
      .slice(0, 10);

    return this.arrSaveList
      .filter(
        option =>
          option.supplier_lists_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
      )
      .slice(0, 10);
  }

  btnRow(e) {
    // this.router.navigate([this.UrlRouter_Saves_Detail, row]);
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Saves_Detail, e.row.supplier_id]);
    }
  }

  refresh() {
    this.service.searchTerm = "";
  }
}
