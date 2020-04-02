import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { DealersComponent } from "./dealers.component";
import { DealersRoutingModule } from "./dealers-routing.module";
import { DealersListComponent } from "./dealers-list/dealers-list.component";
import { DealersSaveComponent } from "./dealers-save/dealers-save.component";
import { DealersDetailComponent } from "./dealers-detail/dealers-detail.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { DropFileModule } from '../drop-file/drop-file.module';

/* shared */
import { SharedModule } from "@project/shared";

import { IConfig, NgxMaskModule } from "ngx-mask";
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: "dd/MM/yyyy" }),
    DealersRoutingModule,
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    DropFileModule,
    NgxSelectModule
  ],
  declarations: [
    DealersComponent,
    DealersListComponent,
    DealersSaveComponent,
    DealersDetailComponent
  ]
})
export class DealersModule {}
