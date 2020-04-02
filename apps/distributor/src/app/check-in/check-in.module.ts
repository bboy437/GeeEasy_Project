import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { CheckInListComponent } from "./check-in-list/check-in-list.component";
import { CheckInDetailComponent } from "./check-in-detail/check-in-detail.component";
import { CheckInRoutingModule } from "./check-in-routing.module";
import { CheckInComponent } from "./check-in.component";
import { DialogsModule } from "../dialogs/dialogs.module";
import { LayoutsModule } from "../layouts/layouts.module";
import { NgxSelectModule } from 'ngx-select-ex';
/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CheckInRoutingModule,
    ThemeModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DialogsModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxSelectModule
  ],
  declarations: [
    CheckInComponent,
    CheckInListComponent,
    CheckInDetailComponent,
  ]
})
export class CheckInModule {}
