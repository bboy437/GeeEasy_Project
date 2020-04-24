import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { CoresModule } from "@project/cores";
import { AppRoutingModule } from "./app-routing.module";
import { NbMenuModule, NbSidebarModule } from "@nebular/theme";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { LayoutsModule } from './layouts/layouts.module';
import { DialogsModule } from "./dialogs/dialogs.module";
import { MapModule } from './map/map.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    CoresModule.forRoot(),
    LayoutsModule,
    DialogsModule,
    MapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
