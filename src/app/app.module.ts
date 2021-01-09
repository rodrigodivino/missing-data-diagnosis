import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagnosisVisualizationComponent } from './diagnosis-visualization/diagnosis-visualization.component';

@NgModule({
  declarations: [AppComponent, DiagnosisVisualizationComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
