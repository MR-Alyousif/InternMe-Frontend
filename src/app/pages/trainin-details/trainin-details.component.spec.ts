import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraininDetailsComponent } from './trainin-details.component';

describe('TraininDetailsComponent', () => {
  let component: TraininDetailsComponent;
  let fixture: ComponentFixture<TraininDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraininDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraininDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
