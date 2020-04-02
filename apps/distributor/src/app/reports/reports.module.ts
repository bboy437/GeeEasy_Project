import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';
import { LayoutsModule } from '../layouts/layouts.module';


@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    LayoutsModule
  ],
  declarations: [
    ReportsComponent,
    ReportsListComponent],
  
})
export class ReportsModule { }
