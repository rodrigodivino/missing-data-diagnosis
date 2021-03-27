import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagnosisVisualizationComponent } from './diagnosis-visualization/diagnosis-visualization.component';
import { OverviewModule } from './overview/overview.module';
import { HorizontalModule } from './horizontal/horizontal.module';

@NgModule({
  declarations: [AppComponent, DiagnosisVisualizationComponent],
  imports: [BrowserModule, AppRoutingModule, OverviewModule, HorizontalModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
