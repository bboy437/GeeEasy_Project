import { async, TestBed } from '@angular/core/testing';
import { NebularModule } from './nebular.module';

describe('NebularModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NebularModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NebularModule).toBeDefined();
  });
});
