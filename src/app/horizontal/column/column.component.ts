import { Component, Input, OnInit } from '@angular/core';
import { InputData } from '../../interfaces/InputData';

@Component({
  selector: 'g[app-column]',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  constructor() {}
  @Input() public width: number;
  @Input() public height: number;
  @Input() public key: string;
  @Input() public mKey: string;
  @Input() public data: InputData;

  ngOnInit(): void {}
}
