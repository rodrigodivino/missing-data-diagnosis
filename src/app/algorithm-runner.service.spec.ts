import { TestBed } from '@angular/core/testing';

import { AlgorithmRunnerService } from './algorithm-runner.service';

describe('AlgorithmRunnerService', () => {
  let service: AlgorithmRunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgorithmRunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
