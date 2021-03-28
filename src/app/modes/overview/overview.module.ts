import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewCellComponent } from './overview-cell/overview-cell.component';
import { OverviewScreenComponent } from './overview-screen/overview-screen.component';

@NgModule({
  declarations: [OverviewCellComponent, OverviewScreenComponent],
  imports: [CommonModule],
  exports: [OverviewCellComponent, OverviewScreenComponent],
})
export class OverviewModule {}
