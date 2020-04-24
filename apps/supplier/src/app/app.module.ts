import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';;
import { CoresModule } from '@project/cores';
import { AppRoutingModule } from './app-routing.module';
import { NbMenuModule, NbSidebarModule, } from '@nebular/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DialogsModule } from './dialogs/dialogs.module';
import { LayoutsModule } from './layouts/layouts.module';
import { DropFileModule } from './drop-file/drop-file.module';



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
    DialogsModule,
    LayoutsModule,
    DropFileModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
