import { NgModule } from '@angular/core';
import { ThemeModule } from '@project/theme-supplier';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularModule } from '@project/nebular';
import { BubbleMapComponent } from './bubble/bubble-map.component';
import { GuideComponent } from './guide/guide.component';
import { IntroComponent } from './intro/intro.component';
import { BlogComponent } from './blog/blog.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutsModule } from '../layouts/layouts.module';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    DashboardRoutingModule,
    LayoutsModule
  ],
  declarations: [
    DashboardComponent,
    BubbleMapComponent,
    GuideComponent,
    IntroComponent,
    BlogComponent
  ]

})
export class DashboardModule { }
