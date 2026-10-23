import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandlordProfile } from './landlord-profile';

describe('LandlordProfile', () => {
  let component: LandlordProfile;
  let fixture: ComponentFixture<LandlordProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandlordProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
