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
    formCreate: FormGroup;
    submitted = false;
    arrSaveList: any = [];
    evaIcons = [];
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
        this.buildFormCreate();

        if (this.isData === 'Rename') {
            this.formCreate.get("name").patchValue(this.data.distributor_lists_name);
        }
        if (this.isData === 'new') {
            this.getSaveList();
        }
    }

    getSaveList() {
        const value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + this.id_local;
        this.saveListSupplierAPIService.getSavelistSup(value).subscribe(data => {
            this.arrSaveList = data.response_data;
            console.log('this.arrSaveList', this.arrSaveList);

        })
    }

    buildFormCreate() {
        this.formCreate = this.formBuilder.group({
            name: ['', Validators.required],
        });
    }

    btnCreate() {
        this.isData = 'create';
        this.buildFormCreate();
    }

    btnCreateClick() {
        this.isSaveLodding = true;
        const dataJson = {
            name: this.formCreate.value.name,
            supplier_id: Number(this.id_local),
        }

        console.log("btnCreateClick : dataJson : ", dataJson);

        this.saveListSupplierAPIService.createSaveListSup(JSON.stringify(dataJson)).subscribe(data => {
            console.log(data);
            this.isSaveLodding = false;
            this.ref.close('ok');
        })
    }

    btnNewClick() {
        this.isSaveLodding = true;

        const dataJson = {
            distributor_lists_id: this.formCreate.value.name,
            distributor_id: this.data.distributor_id
        }
        console.log(dataJson);

        this.saveListSupplierAPIService.addSaveListSup(JSON.stringify(dataJson)).subscribe(data => {
            console.log(data);
            this.isSaveLodding = false;
            this.ref.close('ok');
        })
    }

    btnRenameClick() {
        this.isSaveLodding = true;
        const dataJson = {
            distributor_lists_id: this.data.distributor_lists_id,
            distributor_lists_name: this.formCreate.value.name,

        }
        console.log(JSON.stringify(dataJson));
        this.saveListSupplierAPIService.renameSaveListSup(JSON.stringify(dataJson)).subscribe(data => {
            console.log(data);
            this.isSaveLodding = false;
            this.ref.close('ok');
        })
    }

    btnDeleteAllClick() {
        this.isSaveLodding = true;
        const dataJson = {
            distributor_lists_id: this.data.distributor_lists_id,
        }
        console.log(JSON.stringify(dataJson));
        this.saveListSupplierAPIService.deleteAllSup(JSON.stringify(dataJson)).subscribe(data => {
            console.log(data);
            this.isSaveLodding = false;
            this.ref.close('ok');
        })
    }

    btnDeleteClick() {
        this.isSaveLodding = true;
        const dataJson = {
            distributor_lists_id: this.data.distributor_lists_id,
            supplier_id: this.id_local,
            distributor_id: this.data.distributor_id
        }
        this.saveListSupplierAPIService.deleteSaveListSup(JSON.stringify(dataJson)).subscribe(res => {
            this.isSaveLodding = false;
            this.ref.close('ok');
        })
    }

    btnCancelClick(): void {
        this.ref.close();
    }

}
