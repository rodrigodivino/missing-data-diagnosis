import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisVisualizationComponent } from './diagnosis-visualization.component';

describe('DiagnosisVisualizationComponent', () => {
  let component: DiagnosisVisualizationComponent;
  let fixture: ComponentFixture<DiagnosisVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosisVisualizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
