import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExcelComponent } from './show-excel.component';

describe('ShowExcelComponent', () => {
  let component: ShowExcelComponent;
  let fixture: ComponentFixture<ShowExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowExcelComponent]
    });
    fixture = TestBed.createComponent(ShowExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
