import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-supplier";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SavedListsComponent } from "./saved-lists/saved-lists.component";
import { SavesDetailComponent } from './saves-detail/saves-detail.component';
import { LayoutsModule } from '../../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
/* shared */
import { SharedModule } from "@project/shared";

import { MapDetailModule } from "../../map-detail/map-detail.module";

import { IConfig, NgxMaskModule } from "ngx-mask";
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    MapDetailModule,
    FormsModule,
    ThemeModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    NebularModule.forRoot(),
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule
  ],
  declarations: [SavedListsComponent, SavesDetailComponent]
})
export class SavedListsModule {}
