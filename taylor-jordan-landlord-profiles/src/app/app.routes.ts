import { Routes } from '@angular/router';
import { LandlordProfile } from './landlord-profile/landlord-profile';
import { PropertyListing } from './property-listing/property-listing';

// One route per group member's component. Gio's reviews route gets added here when it's ready.
export const routes: Routes = [
  { path: '', redirectTo: 'properties', pathMatch: 'full' },
  { path: 'properties', component: PropertyListing, title: 'Property Listings' },
  { path: 'landlords', component: LandlordProfile, title: 'Landlord Profiles' },
  { path: '**', redirectTo: 'properties' },
];
