import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScreenComponent } from './horizontal-screen/horizontal-screen.component';
import { ColumnComponent } from './column/column.component';

@NgModule({
  declarations: [HorizontalScreenComponent, ColumnComponent],
  imports: [CommonModule],
  exports: [HorizontalScreenComponent, ColumnComponent],
})
export class HorizontalModule {}
