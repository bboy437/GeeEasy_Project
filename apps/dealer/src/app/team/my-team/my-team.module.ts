import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-dealer";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { BsDatepickerModule } from "ngx-bootstrap";
import { MyTeamComponent } from "./my-team.component";
import { NgxSelectModule } from 'ngx-select-ex';
import { MyteamListComponent } from './myteam-list/myteam-list.component';
import { MyteamDetailComponent } from './myteam-detail/myteam-detail.component';
import { MyteamCreateComponent } from './myteam-create/myteam-create.component';
import { MyTeamRoutingModule } from './my-team-routing.module';
import { LayoutsModule } from '../../layouts/layouts.module';
import { AddProductTeamComponent } from './add-product-team/add-product-team.component';
import { SharedModule } from '@project/shared';
import { AddProductSellerComponent } from './add-product-seller/add-product-seller.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    MyTeamRoutingModule,
    ReactiveFormsModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    BsDatepickerModule.forRoot(),
    LayoutsModule,
    NgxSelectModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
  ],
  declarations: [
    MyTeamComponent,
    MyteamListComponent,
    MyteamDetailComponent,
    MyteamCreateComponent,
    AddProductTeamComponent,
    AddProductSellerComponent
  ]
})
export class MyTeamModule { }
