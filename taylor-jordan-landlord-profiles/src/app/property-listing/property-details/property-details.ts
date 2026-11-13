import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Amenities, Property, PropertyService } from '../property.service';
import { Landlord, LandlordService } from '../../landlord-profile/landlord.service';
import { ReviewService } from '../../services/review.service';

// Property Details [R] from the user flow: shows one listing and the actions
// Edit, Archive, View Landlord and Write a Review.
@Component({
  imports: [RouterLink],
  selector: 'app-property-details',
  styleUrl: './property-details.css',
  templateUrl: './property-details.html',
})
export class PropertyDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private landlordService = inject(LandlordService);
  private reviewService = inject(ReviewService);
  private cdr = inject(ChangeDetectorRef);

  property: Property | null = null;
  reviews: any[] = []; // reviews whose propertyId matches this property
  landlord: Landlord | null = null;
  message = '';

  // Labels for the amenity checkboxes, in the same order as the form
  amenityLabels: { key: keyof Amenities; label: string }[] = [
    { key: 'dishwasher', label: 'Dishwasher' },
    { key: 'basement', label: 'Basement' },
    { key: 'fireplace', label: 'Fireplace' },
    { key: 'laundry', label: 'Laundry In-Unit' },
    { key: 'closet', label: 'Walk In Closet' },
    { key: 'hardwood', label: 'Hardwood Floors' },
    { key: 'pool', label: 'Community Pool' },
    { key: 'porch', label: 'Porch' },
    { key: 'deck', label: 'Deck' },
    { key: 'gated', label: 'Gated Community' },
    { key: 'playground', label: 'Playground' },
  ];

  get amenities(): string[] {
    if (!this.property?.amenities) return [];
    return this.amenityLabels.filter(a => this.property!.amenities[a.key]).map(a => a.label);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getProperty(id).subscribe({
      next: property => {
        this.property = property;
        this.loadLandlord(property.landlord);
        this.loadReviews(property._id!);
        this.cdr.markForCheck();
      },
      error: () => {
        this.message = 'Property not found.';
        this.cdr.markForCheck();
      }
    });
  }

  private loadLandlord(id: string) {
    this.landlordService.getLandlords().subscribe(list => {
      this.landlord = list.find(l => l._id === id) ?? null;
      this.cdr.markForCheck();
    });
  }

  // Reviews for this property (Giovanni's Review Management data)
  private loadReviews(id: string) {
    this.reviewService.getReviews(id).subscribe(list => {
      this.reviews = list;
      this.cdr.markForCheck();
    });
  }

  // Average overall rating, rounded to one decimal (e.g. 4.5)
  get averageRating(): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((sum, r) => sum + Number(r.overallRating), 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }

  editProperty() {
    this.router.navigate(['/properties'], { queryParams: { edit: this.property!._id } });
  }

  // Archive listing? [D] -> Listing archived (hidden from search)
  archiveProperty() {
    if (!confirm('Archive ' + this.property!.address + '?')) return;
    this.propertyService.updateProperty(this.property!._id!, { isArchived: true }).subscribe(updated => {
      this.property = updated;
      this.message = updated.address + ' was archived.';
      this.cdr.markForCheck();
    });
  }

  restoreProperty() {
    this.propertyService.updateProperty(this.property!._id!, { isArchived: false }).subscribe(updated => {
      this.property = updated;
      this.message = updated.address + ' was restored.';
      this.cdr.markForCheck();
    });
  }
}
