import { NgModule } from "@angular/core";
import { ThemeModule } from "@project/theme-dealer";
import { NebularModule } from "@project/nebular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TeamRoutingModule } from "./team-routing.module";
import { TeamComponent } from "./team.component";
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    TeamRoutingModule,
    ReactiveFormsModule,
    NebularModule.forRoot(),
    LayoutsModule,
    NgxSelectModule
  ],
  declarations: [
    TeamComponent,
  ]
})
export class TeamModule { }
