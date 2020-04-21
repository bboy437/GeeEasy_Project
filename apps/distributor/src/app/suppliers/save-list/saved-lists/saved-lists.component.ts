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
import { IsavelistList } from "@project/interfaces";
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
  savelist$: Observable<IsavelistList[]>;
  tatallist$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  arrDelete: any = [];
  strTitle = "";
  supplier_lists_id: number;
  arrRename: any = [];
  filter: any = [];
  private UrlRouter_Saves_Detail = "suppliers/saved-detail";
  strFilter: string;
  id: number;
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
      this.saveListSupplierAPIService.savelistDistSelectedAction$.subscribe(res => {
        if (res) {
          this.id = res.supplier_lists_id;
          this.savedetail = res.supplier_array;
          this.strTitle = res.supplier_lists_name;
          this.supplier_lists_id = res.supplier_lists_id;
          this.arrDelete.false = res.supplier_lists_id;
        }

      });
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
    this.saveListSupplierAPIService.selectedListDistriburor(null);
    this.savedetail = [];
    this.strTitle = "";
    this.id = null;
    this.isReload = true;
    this.service.getData(e => {
      this.savelist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.isReload = false;
    });
  }


  btnClickItem(data: any) {
    console.log(data);
    this.loading = true;
    this.id = data.supplier_lists_id;
    this.saveListSupplierAPIService.selectedListDistriburor(data);
    this.strTitle = data.supplier_lists_name;
    this.supplier_lists_id = data.supplier_lists_id;
    this.savedetail = data.supplier_array;
    this.arrDelete.false = data.supplier_lists_id;
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
        this.btnReload();

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
      if (result) {
        this.btnReload();
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
        this.btnReload();

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
