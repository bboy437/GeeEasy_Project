import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '@project/theme';
import { NebularModule } from '@project/nebular';



@NgModule({
  declarations: [
    ReportsComponent,
    ReportsListComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
  ]
})
export class ReportsModule { }
