import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbIconLibraries,
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbCardModule,
  NbTabsetModule,
  NbRadioModule,
  NbListModule,
  NbDatepickerModule,
  NbInputModule,
  NbProgressBarModule,
  NbAccordionModule,
  NbDialogModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbPopoverModule,
  NbCalendarModule,
  NbToastrModule,
  NbCheckboxModule,
  NbSpinnerModule,
  NbBadgeModule
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NgxEchartsModule } from "ngx-echarts";
import { NbSecurityModule } from "@nebular/security";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgbModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartModule } from "angular2-chartjs";
import { BsDatepickerModule } from "ngx-bootstrap";

const NB_MODULES = [
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbEvaIconsModule,
  NbCardModule,
  NbTabsetModule,
  NbRadioModule,
  NbListModule,
  NbDatepickerModule,
  NbInputModule,
  NbProgressBarModule,
  NgxEchartsModule,
  NgxChartsModule,
  NbAccordionModule,
  NbDialogModule,
  NgbModule,
  NgbPaginationModule,
  ChartModule,
  BsDatepickerModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbPopoverModule,
  NbCalendarModule,
  NbToastrModule,
  NbCheckboxModule,
  NbSpinnerModule,
  NbBadgeModule,

];

@NgModule({
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...NB_MODULES],
  declarations: []
})
export class NebularModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: NebularModule,
      providers: [...NbThemeModule.forRoot().providers, ...NB_MODULES]
    };
  }
}
