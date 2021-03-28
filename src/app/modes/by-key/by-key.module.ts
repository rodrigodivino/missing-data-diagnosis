import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByKeyScreenComponent } from './by-key-screen/by-key-screen.component';
import { LineComponent } from './line/line.component';

@NgModule({
  declarations: [ByKeyScreenComponent, LineComponent],
  imports: [CommonModule],
  exports: [ByKeyScreenComponent],
})
export class ByKeyModule {}
