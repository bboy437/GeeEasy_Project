import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NospacePipe,
  PhoneMaskDirective,
  PhoneNewMaskDirective,
  OnlyCharacterDefault,
  OnlyCharacterDirective,
  OnlyCharacternumberDirective,
  OnlyCharacterphonnumberDirective,
  DecimalMask
} from "./directive-form";
import { NbDialogModule } from "@nebular/theme";
import { ThemeModule } from "@project/theme";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NebularModule } from "@project/nebular";
import { AgmCoreModule } from "@agm/core";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgxSelectModule } from "ngx-select-ex";

import { CompLocationComponent } from "./components/comp-location/comp-location.component";
import { MapsComponent } from "./dialogs/maps/maps.component";

import {
  DisplayFileImageComponent,
  FileUploadComponent,
  FileUploadNoteComponent,
  ListFileUploadComponent,
  CompSummaryComponent,
  CompProductsComponent
} from "./components";
import { FileImageComponent } from "./components/file-image/file-image.component";
import { CompCategoryComponent } from "./components/comp-category/comp-category.component";
import { CompCategoryBrowseComponent } from "./components/comp-category-browse/comp-category.component";
import { OnlyBarcode } from "./directive-form/barcode.directive";
import { OnlySKU } from "./directive-form/sku.directive";
import { OnlyUnit } from './directive-form/unit.directive';
import { CompPaymentComponent } from './components/comp-payment/comp-payment.component';
import { CompProductsSupplierDetailComponent } from './components/comp-products-supplier-detail/comp-products-supplier-detail.component';
import { CompCategoryOwnComponent } from './components/comp-category-own/comp-category-own.component';
import { OnlyProductName } from './directive-form/productname.directive';
import { InputComponent } from './reactive-form/input/input.component';
import { TextareaComponent } from './reactive-form/textarea/textarea.component';
import { SelectComponent } from './reactive-form/select/select.component';
import { IConfig, NgxMaskModule } from "ngx-mask";
import { NgxSelectComponent } from './reactive-form/ngx-select/ngx-select.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    NospacePipe, PhoneMaskDirective, PhoneNewMaskDirective, OnlyCharacterDefault,
    OnlyCharacterDirective, OnlyCharacternumberDirective, OnlyCharacterphonnumberDirective,
    OnlySKU, OnlyBarcode, CompProductsComponent, CompSummaryComponent,
    DisplayFileImageComponent, FileUploadComponent, FileUploadNoteComponent,
    ListFileUploadComponent, DecimalMask, CompLocationComponent,
    MapsComponent, FileImageComponent, CompCategoryComponent,
    CompCategoryBrowseComponent, OnlyUnit, CompPaymentComponent,
    CompProductsSupplierDetailComponent, CompCategoryOwnComponent, OnlyProductName,
    InputComponent, TextareaComponent, SelectComponent, NgxSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NebularModule.forRoot(),
    DragDropModule,
    NgxSelectModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w",
      libraries: ["places"]
    }),
    NbDialogModule.forChild(),
    NgxMaskModule.forRoot(options),
  ],
  exports: [
    NospacePipe, PhoneMaskDirective, PhoneNewMaskDirective, OnlyCharacterDefault,
    OnlyCharacterDirective, OnlyCharacternumberDirective, OnlyCharacterphonnumberDirective,
    OnlySKU, OnlyBarcode, CompProductsComponent, CompSummaryComponent, DisplayFileImageComponent,
    FileImageComponent, FileUploadComponent, FileUploadNoteComponent, ListFileUploadComponent,
    DecimalMask, CompLocationComponent, MapsComponent, CompCategoryComponent, CompCategoryBrowseComponent,
    OnlyUnit, CompPaymentComponent, CompProductsSupplierDetailComponent, CompCategoryOwnComponent,
    OnlyProductName, InputComponent, NgxSelectComponent, TextareaComponent, SelectComponent
  ],
  entryComponents: [MapsComponent]
})
export class SharedModule { }
