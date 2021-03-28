import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByMissingKeyScreenComponent } from './by-missing-key-screen/by-missing-key-screen.component';
import { ColumnComponent } from './column/column.component';

@NgModule({
  declarations: [ByMissingKeyScreenComponent, ColumnComponent],
  imports: [CommonModule],
  exports: [ByMissingKeyScreenComponent, ColumnComponent],
})
export class ByMissingKeyModule {}
