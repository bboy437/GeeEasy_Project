import { async, TestBed } from '@angular/core/testing';
import { CoresModule } from './cores.module';

describe('CoresModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoresModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CoresModule).toBeDefined();
  });
});
