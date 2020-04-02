import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-supplier";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { BsDatepickerModule } from "ngx-bootstrap";
import { AccountsRoutingModule } from "./accounts-routing.module";
import { AccountsComponent } from "./accounts.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { InfoListComponent } from './info-list/info-list.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { DeliveryInformationListComponent } from "./delivery-information-list/delivery-information-list.component";
import { SharedModule } from '@project/shared';
import { IConfig, NgxMaskModule } from "ngx-mask";

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NebularModule.forRoot(),
    AccountsRoutingModule,
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    BsDatepickerModule.forRoot(),
    LayoutsModule,
    NgxSelectModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
  ],
  declarations: [AccountsComponent, InfoListComponent, DeliveryInformationListComponent]
})
export class AccountsModule { }
