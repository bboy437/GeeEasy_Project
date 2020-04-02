import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-dealer";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { BsDatepickerModule } from "ngx-bootstrap";
import { AccountsRoutingModule } from "./accounts-routing.module";
import { AccountsComponent } from "./accounts.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { InfoListComponent } from './info-list/info-list.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from "@project/shared";

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    AccountsRoutingModule,
    ReactiveFormsModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    BsDatepickerModule.forRoot(),
    LayoutsModule,
    NgxSelectModule,
    SharedModule
  ],
  declarations: [AccountsComponent, InfoListComponent]
})
export class AccountsModule {}
