import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SaveListSupplierAPIService } from '@project/services';

@Component({
  selector: 'project-dialogs-saved-list',
  templateUrl: './dialogs-saved-list.component.html',
  styleUrls: ['./dialogs-saved-list.component.scss']
})
export class DialogsSavedListComponent implements OnInit {

  @Input() data: any;
  @Input() isData: string;
  arrobjRow: any = {};
  saveListForm: FormGroup;
  submitted = false;
  arrSaveList: any = [];
  evaIcons = [];
  loading = false;
  isSaveLodding = false;
  id_local: string;

  constructor(
    private saveListSupplierAPIService: SaveListSupplierAPIService,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsSavedListComponent>,
    iconsLibrary: NbIconLibraries) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);

    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
    console.log('data', this.data);
    console.log('isData', this.isData);

    // this.arrobjRow.name = '';
    // this.arrobjRow.supplier_lists_id = '';
    if (this.isData === 'new') {
      this.buildForm();
      this.getSaveList();
    }
    if (this.isData === 'create') {
      this.buildForm();
    }
    if (this.isData === 'Rename') {
      this.buildForm();
      setTimeout(() => {
        this.saveListForm.get('name').patchValue(this.data.supplier_lists_name);
      }, 0);
    }
  }


  getSaveList() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + this.id_local;
    this.saveListSupplierAPIService.getSaveList(value).subscribe(data => {
      this.arrSaveList = data.response_data;
      console.log('this.arrSaveList', this.arrSaveList);

    })
  }

  buildForm() {
    this.saveListForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  get f() { return this.saveListForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.saveListForm.invalid) {
      return;
    }
  }

  btnCreate() {
    this.loading = true;
    setTimeout(() => {
      this.saveListForm.get('name').patchValue('');
    }, 0);
    this.isData = 'create';
    this.loading = false;
  }


  btnCreateClick() {
    this.loading = true;
    const dataJson = {
      name: this.saveListForm.value.name,
      distributor_id: this.id_local,
    }

    this.saveListSupplierAPIService.createSaveListDist(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      // this.getSaveList();
      // this.arrobjRow.name = '';
      // this.arrobjRow.supplier_lists_id = '';
      this.loading = false;
      this.ref.close('ok')
    })
  }

  btnOkClick() {
    this.loading = true;
    const dataJson = {
      supplier_lists_id: this.saveListForm.value.name,
      supplier_id: this.data.supplier_id,
      distributor_id: this.id_local
    }
    console.log(JSON.stringify(dataJson));
    this.saveListSupplierAPIService.addSaveListDist(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.ref.close('ok')
    })
  }

  btnRenameClick() {
    this.loading = true;
    const dataJson = {
      supplier_lists_id: this.data.supplier_lists_id,
      supplier_lists_name: this.saveListForm.value.name,

    }
    console.log(JSON.stringify(dataJson));
    this.saveListSupplierAPIService.renameSaveListDist(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.ref.close('ok')
    })
  }

  btnDeleteAllClick() {
    this.loading = true;
    const dataJson = {
      supplier_lists_id: this.data.supplier_lists_id,
    }
    console.log(JSON.stringify(dataJson));
    this.saveListSupplierAPIService.deleteAllDist(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.ref.close('ok')
    })
  }



  btnDeleteClick() {
    this.loading = true;
    const dataJson = {
      supplier_lists_id: this.data.supplier_lists_id,
      supplier_id: this.data.supplier_id,
      distributor_id: this.id_local
    }
    console.log(JSON.stringify(dataJson));
    this.saveListSupplierAPIService.deleteSaveListDist(JSON.stringify(dataJson)).subscribe(res => {
      this.loading = false;
      this.ref.close('ok')
    })
  }


  btnCancelClick(): void {
    this.ref.close();
  }

}
