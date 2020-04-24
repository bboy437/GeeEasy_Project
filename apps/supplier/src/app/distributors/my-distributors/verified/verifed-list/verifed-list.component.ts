import { Component, OnInit, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { DistributorAPIService, VerifiedService } from '@project/services';
import { Router } from '@angular/router';
import { Observable, Subject, EMPTY, BehaviorSubject, combineLatest } from 'rxjs';
import { DialogsSavedListComponent } from '../../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { catchError, map, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'project-verifed-list',
  templateUrl: './verifed-list.component.html',
  styleUrls: ['./verifed-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class VerifedListComponent implements OnInit {

  private UrlRouter_VerifedDetail = "distributors/veriferd/detail";
  arrDistributors: any = [];
  arrDistributorDetail: any = [];
  arrDistributorCate: any = [];
  filters: any = [];
  isCheckData: string;
  id: string;
  loading = false;
  isReload = false;
  strname: string;
  ColumnMode = ColumnMode;
  id_local: string;
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
  Form: FormGroup;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // Action filter stream
  private fillterNameSubject = new BehaviorSubject<string>("");
  fillterNameAction$ = this.fillterNameSubject.asObservable();

  verifieds$ = combineLatest([
    this.verifiedService.verifieds$,
    this.fillterNameAction$
  ])
    .pipe(
      map(([verifieds, name]) =>
        verifieds.filter(product =>
          product.toString().indexOf(name.toLowerCase()) > -1)
      ),
      tap((data) => {
        // this.isReload = false;
      }),
      catchError(err => {
        window.alert(err);
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );


  selectedCategory$ = this.verifiedService.selectedCategory$
    .pipe(
      tap((data) => this.loading = false),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  filterVerifieds(value) {
    console.log(value);
    this.fillterNameSubject.next(value);
  }

  constructor(
    private distributorAPIService: DistributorAPIService,
    private verifiedService: VerifiedService,
    private router: Router,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }


  ngOnInit() {

    this.Form = this.formBuilder.group({
      filterName: ["", Validators.required],
    });

    this.loading = false;
  }


  btnReload() {
    this.isReload = true;
    this.id = "";
    this.verifiedService.verifieds$.subscribe();
    this.verifiedService.selectedCategoryChanged("");
    this.isReload = false;
  }

  btnRefresh() {
    this.fillterNameSubject.next("");
  }

  btnClickItem(data) {
    this.loading = true;
    this.id = data;
    this.verifiedService.selectedCategoryChanged(data)
    this.loading = false;
  }

  getDistributor(catalog) {
    this.id = catalog;
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&supplier_id=" + this.id_local + "&catalog=" + this.id;
    this.distributorAPIService.getVerifiedDistList(value).subscribe(data => {
      this.arrDistributors = data.response_data;
      console.log(this.arrDistributors);
      this.loading = false;

    })
  }

  btnDialogSavelists(data) {
    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: data,
        isData: 'new'
      }
    });
    dialogRef.onClose.subscribe(result => {
      console.log(result);
      if (result) {
      }
    });
  }

  btnRowClick() {
    this.router.navigate([this.UrlRouter_VerifedDetail, this.arrDistributors.distributor_id]);
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_VerifedDetail, e.row.distributor_id]);
    }
  }

  filter(value: any) {
    this.arrDistributorCate = this.filters.filter(option =>
      option.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);
    return this.arrDistributorCate.filter(option =>
      option.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);

  }


}
