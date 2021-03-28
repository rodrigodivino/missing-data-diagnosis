import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalScreenComponent } from './vertical-screen/vertical-screen.component';
import { LineComponent } from './line/line.component';

@NgModule({
  declarations: [VerticalScreenComponent, LineComponent],
  imports: [CommonModule],
  exports: [VerticalScreenComponent],
})
export class ByKeyModule {}
