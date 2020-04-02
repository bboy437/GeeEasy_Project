import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule } from "@angular/forms";
import { NebularModule } from "@project/nebular";
import { GuideComponent } from "./guide/guide.component";
import { IntroComponent } from "./intro/intro.component";
import { BlogComponent } from "./blog/blog.component";
import { NbToastrModule } from "@nebular/theme";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    NbToastrModule.forRoot(),
    DashboardRoutingModule,
    LayoutsModule
  ],
  declarations: [
    DashboardComponent,
    GuideComponent,
    IntroComponent,
    BlogComponent
  ]
})
export class DashboardModule {}
