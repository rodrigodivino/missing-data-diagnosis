import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'g[app-overview-cell]',
  templateUrl: './overview-cell.component.html',
  styleUrls: ['./overview-cell.component.scss'],
})
export class OverviewCellComponent implements OnInit {
  @Input() public width: number;
  @Input() public height: number;
  constructor() {}

  ngOnInit(): void {}
}
