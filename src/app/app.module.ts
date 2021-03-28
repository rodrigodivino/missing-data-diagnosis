import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagnosisVisualizationComponent } from './diagnosis-visualization/diagnosis-visualization.component';
import { OverviewModule } from './modes/overview/overview.module';
import { ByMissingKeyModule } from './modes/by-missing-key/by-missing-key.module';
import { ByKeyModule } from './modes/by-key/by-key.module';

@NgModule({
  declarations: [AppComponent, DiagnosisVisualizationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OverviewModule,
    ByMissingKeyModule,
    ByKeyModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
