import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SavedListsComponent } from "./saved-lists/saved-lists.component";
import { SavedDetailComponent } from "./saved-detail/saved-detail.component";
import { TableComponent } from "../../core/component/table/table.component";
import { LayoutsModule } from '../../layouts/layouts.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

 /* shared */
 import { SharedModule } from "@project/shared";

 import { IConfig, NgxMaskModule } from "ngx-mask";
import { MapModule } from '../../map/map.module';
 export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    NebularModule.forRoot(),
    LayoutsModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    NgxDatatableModule,
    MapModule
  ],
  declarations: [SavedListsComponent, SavedDetailComponent,TableComponent]
})
export class SaveListModule {}
