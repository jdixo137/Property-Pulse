import { Routes } from '@angular/router';
import { LandlordProfile } from './landlord-profile/landlord-profile';
import { PropertyListing } from './property-listing/property-listing';
import { ReviewManagement } from './review-management/review-management';
import { PropertyDetails } from './property-listing/property-details/property-details';

// One route per group member's component.
export const routes: Routes = [
  { path: '', redirectTo: 'properties', pathMatch: 'full' },
  { path: 'properties', component: PropertyListing, title: 'Property Listings' },
  { path: 'properties/:id', component: PropertyDetails, title: 'Property Details' },
  { path: 'landlords', component: LandlordProfile, title: 'Landlord Profiles' },
  { path: 'reviews', component: ReviewManagement, title: 'Reviews' },
  { path: '**', redirectTo: 'properties' },
];
