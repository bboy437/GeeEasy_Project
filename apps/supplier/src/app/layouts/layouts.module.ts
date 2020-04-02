import { NgModule } from '@angular/core';
import { ThemeModule } from '@project/theme-supplier';
import { NebularModule } from '@project/nebular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbChatModule, NbToastrModule, NbToastrService } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { TimingPipe } from './pipes/timing.pipe';
import { NumberWithCommasPipe } from './pipes/number-with-commas.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { OneColumnLayoutComponent } from './column/column.layout';
import { MessagesModule } from '../messages/messages.module';
import { FooterComponentComponent } from './footercomponent/footercomponent.component';
import { SharedModule } from '@project/shared';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    ThemeModule.forRoot(),
    NebularModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: 'dd/MM/yyyy' }),
    NbChatModule, 
    NbToastrModule.forRoot(),
    MessagesModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
  ],
  
  declarations: [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    HeaderComponent,
    FooterComponent,
    OneColumnLayoutComponent,
    FooterComponentComponent
  ],
  providers: [
    NbToastrService
  ],
  exports: [
    CommonModule,     
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    HeaderComponent,
    FooterComponent,
    FooterComponentComponent,
    OneColumnLayoutComponent],
})
export class LayoutsModule { }
