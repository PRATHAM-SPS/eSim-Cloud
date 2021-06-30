import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SimulatorComponent } from './simulator/simulator.component';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { CodeEditorComponent } from './code-editor/code-editor.component';
// import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { ViewComponentInfoComponent } from './view-component-info/view-component-info.component';
import { HttpClientModule } from '@angular/common/http';
import { ExportfileComponent } from './exportfile/exportfile.component';
import { ComponentlistComponent } from './componentlist/componentlist.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderComponent } from './header/header.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { AlertModalComponent } from './alert/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './alert/confirm-modal/confirm-modal.component';
import { ExportJSONDialogComponent } from './export-jsondialog/export-jsondialog.component';
import { ExitConfirmDialogComponent } from './exit-confirm-dialog/exit-confirm-dialog.component';
import { OptionModalComponent } from './alert/option-modal/option-modal.component';
import { MaterialModule } from './material/material.module';
import { FormsService } from './forms.service';
import { LTIFormDialogComponent } from './lti-form-dialog/lti-form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Monaco OnLoad Function
 */
export function onMonacoLoad() { }

/**
 * Monaco editor config for loading js files
 */
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets',
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad
};



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SimulatorComponent,
    CodeEditorComponent,
    ViewComponentInfoComponent,
    ExportfileComponent,
    ComponentlistComponent,
    FrontPageComponent,
    GalleryComponent,
    ViewProjectComponent,
    HeaderComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    OptionModalComponent,
    ExportJSONDialogComponent,
    ExitConfirmDialogComponent,
    LTIFormDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  // providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, FormsService],
  bootstrap: [AppComponent],
  entryComponents: [
    ViewComponentInfoComponent,
    ExportfileComponent,
    ComponentlistComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    OptionModalComponent,
    ExportJSONDialogComponent,
    ExitConfirmDialogComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [HeaderComponent]
})
export class AppModule { }
