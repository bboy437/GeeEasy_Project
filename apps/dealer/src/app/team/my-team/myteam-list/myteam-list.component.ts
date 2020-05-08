import { Component, OnInit, ViewChild, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SortEvent, NgbdSortableHeader, DealerAPIService, OrderAPIService, DistributorAPIService, TeamAPIService } from '@project/services';
import { ITeam } from '@project/interfaces';
import { NbDialogService } from '@nebular/theme';
import { DialogsTeamComponent } from '../../../dialogs/dialogs-team/dialogs-team.component';
import { DialogsTeamCreateComponent } from '../../../dialogs/dialogs-team-create/dialogs-team-create.component';
import { DeleteComponent } from '../../../dialogs/delete/delete.component';


@Component({
  selector: 'project-myteam-list',
  templateUrl: './myteam-list.component.html',
  styleUrls: ['./myteam-list.component.scss'],
})
export class MyteamListComponent implements OnInit {

  private UrlRouter_SellerCreate = "team/seller/create";
  private UrlRouter_TeamDetail = "team/myteam/detail";
  private UrlRouter_SellerDetail = "team/seller/detail";
  private UrlRouter_TeamCreate = "team/myteam/create";
  private UrlRouter_PurchaseBack = "dealers/list";
  formControl = new FormControl(new Date());
  arrTeam: any = [];
  arrGroup: any = [];
  arrSeller: any = [];
  filter: any = [];
  filter1: any = [];
  Form: FormGroup;
  group_name: string;
  team_name: string;
  group_id_group: string;
  group_id_team: string;
  loading = false;
  loading1 = false;
  loading2 = false;
  isReload = false;
  isStatusGroup = true;
  isStatusTeam = true;
  name = "";

  id_local: string;

  voneMonthAgo = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    new Date().getDate()
  )

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private teamAPIService: TeamAPIService,
    private formBuilder: FormBuilder,
  ) {
    this.id_local = localStorage.getItem('id');
    this.loading = true;
  }


  ngOnInit() {
    this.Form = this.formBuilder.group({
      strGroup: [],
      strTeam: [],
    });

    this.getDataGroup(0)

  }



  getDataGroup(group_id) {
    this.group_id_group = '';
    this.group_id_team = '';
    this.arrTeam = [];
    this.loading = true;
    const value = "cur_page=" + 1 + "&per_page=" + 200 + "&dealer_id=" + this.id_local + "&group_parent_id=" + group_id;
    this.teamAPIService.getTeamList(value).subscribe(res => {
      const arrGroup = res.response_data;
      if (arrGroup.length !== 0) {
        this.arrGroup = arrGroup.filter((x) => x.group_display_id !== 0 && x.group_default_id !== 1)
        this.filter = this.arrGroup
      }
      console.log('arrGroup', arrGroup);
      console.log('arrGroup', this.arrGroup);
      this.loading = false;
    })
  }



  getSeller(event) {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local + "&group_parent_id=" + event.group_id;
    this.teamAPIService.getTeamList(value).subscribe(res => {
      const team = res.response_data;
      if (team.length !== 0) {
        this.arrTeam = team.filter((x) => x.group_display_id !== 0)
        this.filter1 = this.arrTeam;
      } else {
        this.arrSeller.push(event)
      }
      this.loading1 = false;
      this.loading2 = false;
      console.log('arrTeam', this.arrTeam);
    })
  }

  groupChange(event) {
    console.log('event', event);
    this.arrSeller = [];
    this.arrTeam = [];
    this.loading1 = true;
    this.loading2 = true;
    this.isStatusGroup = event.group_default_id === 1 ? true : false;
    this.isStatusTeam = true;
    this.team_name = "";
    this.group_name = event.group_name;
    this.group_id_group = event.group_id;
    console.log(this.group_id_group);

    this.getSeller(event);

  }


  teamChange(event) {
    console.log('event', event);
    this.arrSeller = [];
    this.loading2 = true;
    this.isStatusTeam = false;
    this.team_name = event.group_name;
    this.group_id_team = event.group_id;
    this.getSeller(event);
  }

  filterGroup(value) {
    this.arrGroup = this.filter
      .filter(
        option =>
          option.group_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
      )
      .slice(0, 10);

    return this.arrGroup
      .filter(
        option =>
          option.group_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
      )
      .slice(0, 10);
    // this.service.searchTerm = value;
  }

  filterTeam(value) {
    this.arrTeam = this.filter1
      .filter(
        option =>
          option.group_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
      )
      .slice(0, 10);

    return this.arrTeam
      .filter(
        option =>
          option.group_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
      )
      .slice(0, 10);
    // this.service.searchTerm = value;
  }


  createNewGroup() {
    const dialogRef = this.dialogService.open(DialogsTeamCreateComponent, {
      context: {
        RowID: 'new',
        status: 'Group',
        group_id_group: '0'
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.group_id_group = '';
        this.group_id_team = '';
        this.arrGroup = [];
        this.arrTeam = [];
        this.arrSeller = [];
        this.loading = true;
        this.getDataGroup(0);
      }
    });
  }

  createNewTeam() {
    const dialogRef = this.dialogService.open(DialogsTeamCreateComponent, {
      context: {
        RowID: 'new',
        status: 'Team',
        group_id_group: this.group_id_group,
        group_name: this.group_name
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.group_id_group = '';
        this.group_id_team = '';
        this.arrGroup = [];
        this.arrTeam = [];
        this.arrSeller = [];
        this.loading = true;
        this.getDataGroup(0);
      }
    });
  }


  DeleteGroup() {
    const dialogRef = this.dialogService.open(DeleteComponent, {
      context: {
        icon: 'people-outline',
        title: 'My Team',
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        const dataJson = {
          "group_id": this.group_id_group
        }
        console.log(dataJson);
        this.teamAPIService.deleteGroup(JSON.stringify(dataJson)).subscribe(res => {
          console.log(res);
          this.group_name = "";
          this.team_name = "";
          this.group_id_team = "";
          this.group_id_group = "";
          this.arrGroup = [];
          this.arrTeam = [];
          this.arrSeller = [];
          this.isStatusTeam = true;
          this.isStatusGroup = true;
          this.loading = true;
          this.getDataGroup(0);

        })
      }
    });
  }


  DeleteTeam() {
    const dialogRef = this.dialogService.open(DeleteComponent, {
      context: {
        icon: 'people-outline',
        title: 'My Team',
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        const dataJson = {
          "group_id": this.group_id_team
        }
        this.teamAPIService.deleteTeam(JSON.stringify(dataJson)).subscribe(res => {
          console.log(res);
          this.group_name = "";
          this.team_name = "";
          this.group_id_team = "";
          this.group_id_group = "";
          this.arrGroup = [];
          this.arrTeam = [];
          this.arrSeller = [];
          this.isStatusTeam = true;
          this.isStatusGroup = true;
          this.loading = true;
          this.getDataGroup(0);

        })
      }
    });
  }



  btnReset() {
  }


  btnRefreshGroup() {
    this.Form.get('strGroup').patchValue('');
    this.filterGroup('')
  }

  btnRefreshTeam() {
    this.Form.get('strTeam').patchValue('');
    this.filterTeam('')
  }

  btnGroupDetailClick() {
    this.router.navigate([this.UrlRouter_TeamDetail, this.group_id_group, 'group']);
  }

  btnTeamDetailClick() {
    this.router.navigate([this.UrlRouter_TeamDetail, this.group_id_team, 'team']);
  }

  btnNewClick() {
    this.router.navigate([this.UrlRouter_TeamCreate, "new"]);
  }

  btnNewSellerClick() {
    this.router.navigate([this.UrlRouter_SellerCreate, "new"]);
  }

  btnRowClick(row: any) {
    this.router.navigate([this.UrlRouter_SellerDetail, row, 'team']);
  }

  btnBackClick() {
    this.router.navigate([this.UrlRouter_PurchaseBack]);
  }



}