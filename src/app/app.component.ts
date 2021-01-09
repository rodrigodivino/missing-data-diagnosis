import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor() {}
  @ViewChild('main')
  main: ElementRef<HTMLElement>;

  public mainWidth: number;
  public mainHeight: number;

  title = 'Missing Diagnosis Tool';
  @HostListener('window:resize')
  onResize(): void {
    this.mainWidth = this.main.nativeElement.clientWidth;
    this.mainHeight = this.main.nativeElement.clientHeight;
  }
  ngAfterViewInit(): void {
    setTimeout(this.onResize.bind(this));
  }

  ngOnInit(): void {}
}
