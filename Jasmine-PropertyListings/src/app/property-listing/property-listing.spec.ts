//Source: https://angular.dev/guide/forms/reactive-forms

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyListing } from './property-listing';

describe('PropertyListing', () => {
  let component: PropertyListing;
  let fixture: ComponentFixture<PropertyListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyListing],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
