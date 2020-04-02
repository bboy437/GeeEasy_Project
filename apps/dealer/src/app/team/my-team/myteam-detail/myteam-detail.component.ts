
import { Component, OnInit } from '@angular/core';
import { TeamAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogsTeamComponent } from '../../../dialogs/dialogs-team/dialogs-team.component';
import { DialogsTeamCreateComponent } from '../../../dialogs/dialogs-team-create/dialogs-team-create.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'project-myteam-detail',
    templateUrl: './myteam-detail.component.html',
    styleUrls: ['./myteam-detail.component.scss']
})
export class MyteamDetailComponent implements OnInit {
    private UrlRouter_List = "team/myteam/list";
    private UrlRouter_Edit = "team/myteam/create";
    private UrlRouter_AddProductToTeam = "team/myteam/add-product-team";
    private UrlRouter_AddProductToSeller = "team/myteam/add-product-seller";
    private UrlRouter_SellerDetail = "team/seller/detail";
    Form: FormGroup;
    RowID: string;
    RowStatus: string;
    arrobjRow: any = [];
    arrUser: any = [];
    arrTeam: any = [];
    loading = false;
    group_parent_id: number;
    group_name: string;

    id_local: string;

    constructor(
        private teamAPIService: TeamAPIService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogService: NbDialogService,
        private fb: FormBuilder,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;
    }

    ngOnInit() {
        this.Builder();
        const params = this.route.snapshot.paramMap;

        if (params.has("id")) {
            this.RowID = params.get("id");
            this.RowStatus = params.get("status");
            console.log('RowStatus', this.RowStatus);

            if (this.RowID === "new") {
            } else {
                this.getData();
            }
        }
    }

    Builder() {
        this.Form = this.fb.group({
            group_name: [{ value: '', disabled: true }, Validators.required]
        });
    }


    getData() {
        this.teamAPIService.getTeamDetail(this.RowID).subscribe(res => {
            this.arrobjRow = res.response_data[0];
            this.arrUser = res.response_data[0].group_user_array
            this.getSeller(-1)
            console.log(this.arrobjRow);
            this.Form.get('group_name').patchValue(this.arrobjRow.group_name);
            this.loading = false;
        })
    }

    getSeller(group_id) {
        const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local + "&group_parent_id=" + 0 + "&group_id=" + group_id;
        this.teamAPIService.getTeamList(value).subscribe(data => {
            const team = data.response_data;
            for (let index = 0; index < team.length; index++) {
                if (team[index].group_id === this.arrobjRow.group_parent_id) {
                    this.arrTeam.push(team[index])
                }
            }
            if (this.arrTeam.length > 0) {
                this.group_name = this.arrTeam[0].group_name
            } else {
                this.group_name = "No Group"
            }
            console.log('team', this.arrTeam);


        })

    }

    addSellerToTeamChange() {
        const dialogRef = this.dialogService.open(DialogsTeamComponent, {
            context: {
                id: this.arrobjRow.group_id,
                data: this.arrobjRow,
                status: 'addSeallertoTeam',
            }
        });

        dialogRef.onClose.subscribe(result => {
            if (result === 'cancel') {
            }
            if (result === 'ok') {
                this.loading = true;
                this.getData();
            }
        });
    }


    addProductToTeamChange() {

        // const dialogRef = this.dialogService.open(DialogsTeamComponent, {
        //     context: {
        //         id: this.arrobjRow.group_id,
        //         data: this.arrobjRow,
        //         status: 'addProducttoTeam',
        //     }
        // });

        // dialogRef.onClose.subscribe(result => {
        //     if (result === 'cancel') {
        //     }
        //     if (result === 'ok') {
        //         this.loading = true;
        //         this.getData();
        //     }
        // });
        this.router.navigate([this.UrlRouter_AddProductToTeam, this.arrobjRow.group_id, this.arrobjRow.group_name, this.RowStatus]);
    }


    addProductToSellerChange(data) {
        console.log(data);

        this.router.navigate([this.UrlRouter_AddProductToSeller, this.arrobjRow.group_id, data.user_id, data.user_name, this.RowStatus]);

        // const dialogRef = this.dialogService.open(DialogsTeamComponent, {
        //     context: {
        //         id: this.arrobjRow.group_id,
        //         data: this.arrobjRow,
        //         dataUser: data,
        //         status: 'addProducttoSeller',
        //     }
        // });

        // dialogRef.onClose.subscribe(result => {
        //     if (result === 'cancel') {
        //     }
        //     if (result === 'ok') {
        //         this.loading = true;
        //         this.getData();
        //     }
        // });
    }

    btnCancelClick() {
        this.router.navigate([this.UrlRouter_List]);

    }

    createNewTeam() {
        let status = "";
        this.RowStatus === 'group' ? status = 'Group' : status = 'Team';

        const dialogRef = this.dialogService.open(DialogsTeamCreateComponent, {
            context: {
                RowID: this.arrobjRow.group_id,
                status: status,
                group_id_group: ''
            }
        });

        dialogRef.onClose.subscribe(result => {
            if (result === 'cancel') {
            }
            if (result === 'ok') {
                this.loading = true;
                this.getData();
            }
        });
    }

    btnSaveClick() {
        this.router.navigate([this.UrlRouter_Edit, this.arrobjRow.group_id]);
    }

    btnRowClick(row: any) {
        this.router.navigate([this.UrlRouter_SellerDetail, row, 'team']);
      }
    

}
