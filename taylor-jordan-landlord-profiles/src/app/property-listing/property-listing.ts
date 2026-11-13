import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Amenities, Property, PropertyService } from './property.service';
import { Landlord, LandlordService } from '../landlord-profile/landlord.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-property-listing',
  styleUrl: './property-listing.css',
  templateUrl: './property-listing.html',
})
export class PropertyListing implements OnInit {
private propertyService = inject(PropertyService);
private landlordService = inject(LandlordService);
private cdr = inject(ChangeDetectorRef);
private router = inject(Router);
private route = inject(ActivatedRoute);

propertyForm = new FormGroup({
   address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]),
    propertyType: new FormControl('', [Validators.required]),
    rentPrice: new FormControl('', [Validators.required, Validators.min(100)]),
    beds: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    amenities: new FormGroup({
      dishwasher: new FormControl(false),
      basement: new FormControl(false),
      fireplace: new FormControl(false),
      laundry: new FormControl(false),
      closet: new FormControl(false),
      hardwood: new FormControl(false),
      pool: new FormControl(false),
      porch: new FormControl(false),
      deck: new FormControl(false),
      gated: new FormControl(false),
      playground: new FormControl(false),
    }),
    landlord: new FormControl('', [Validators.required]),
});

get address() {
  return this.propertyForm.get('address')!;
}

get city() {
  return this.propertyForm.get('city')!;
}

get state() {
  return this.propertyForm.get('state')!;
}

get zip() {
  return this.propertyForm.get('zip')!;
}

get propertyType() {
  return this.propertyForm.get('propertyType')!;
}

get rentPrice() {
  return this.propertyForm.get('rentPrice')!;
}

get beds() {
  return this.propertyForm.get('beds')!;
}

get baths() {
  return this.propertyForm.get('baths')!;
}

get landlord() {
  return this.propertyForm.get('landlord')!;
}

properties: Property[] = [];
landlords: Landlord[] = [];

// null = Add mode, otherwise the MongoDB _id of the property being edited.
editingId: string | null = null;

showArchived = false;
message = '';

// Property Search [R]: text typed in the search box
searchText = '';

// The Add/Edit form only opens when needed (no search results, or Edit),
// so the page starts with the address search like the user flow.
showForm = false;

private scrollToForm() {
  setTimeout(() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' }));
}


ngOnInit() {
  this.restoreDraft();
  this.loadProperties();
  this.loadLandlords();
}

// "Add a Landlord": save what's typed so far, then open Landlord Profiles.
addLandlord() {
  this.propertyService.draft = {
    values: this.propertyForm.getRawValue(),
    editingId: this.editingId,
    landlordIds: this.landlords.map(l => l._id!),
  };
  this.router.navigate(['/landlords']);
}

// Coming back from Landlord Profiles: put the unfinished form back.
private landlordIdsBeforeDraft: string[] | null = null;

private restoreDraft() {
  const draft = this.propertyService.draft;
  if (draft) {
    this.propertyForm.setValue(draft.values);
    this.editingId = draft.editingId;
    this.showForm = true;
    this.landlordIdsBeforeDraft = draft.landlordIds;
    this.message = 'Welcome back! Your property details were saved. Check the landlord and click Save.';
    this.propertyService.draft = null;
  }
}

// After the landlord list reloads, pre-select the landlord that was just added.
private selectNewLandlord() {
  if (!this.landlordIdsBeforeDraft) return;
  const added = this.activeLandlords.filter(l => !this.landlordIdsBeforeDraft!.includes(l._id!));
  if (added.length > 0 && !this.landlord.value) {
    this.landlord.setValue(added[added.length - 1]._id!);
  }
  this.landlordIdsBeforeDraft = null;
}

// READ: get all properties from MongoDB
loadProperties() {
  this.propertyService.getProperties().subscribe({
    next: data => {
      this.properties = data;
      this.openEditFromDetails();
      this.cdr.markForCheck();
    },
    error: () => {
      this.message = 'Could not load properties. Is the server running?';
      this.cdr.markForCheck();
    }
  });
}

// Landlord dropdown: active landlords from Taylor's Landlords collection
loadLandlords() {
  this.landlordService.getLandlords().subscribe(data => {
    this.landlords = data;
    this.selectNewLandlord();
    this.cdr.markForCheck();
  });
}

get activeLandlords(): Landlord[] {
  return this.landlords.filter(l => !l.isArchived);
}

landlordName(id: string): string {
  return this.landlords.find(l => l._id === id)?.landlordName ?? 'Unknown';
}

// Read + Property Search: hide archived (unless Show Archived) and match the search text
// against the address, city, state or zip.
get visibleProperties(): Property[] {
  const search = this.searchText.trim().toLowerCase();
  return this.properties.filter(p =>
    (this.showArchived || !p.isArchived) &&
    (!search || [p.address, p.city, p.state, p.zip].join(' ').toLowerCase().includes(search))
  );
}

// "No properties found": start a new listing with what was searched filled into
// the matching field, since search covers street, city, state or zip.
addFromSearch() {
  const text = this.searchText.trim();
  this.cancelEdit();
  this.showForm = true;
  // A 5-digit search can only be a zip code; anything else goes in Address
  // (street names and city names can't be told apart reliably).
  if (/^\d{5}$/.test(text)) {
    this.propertyForm.patchValue({ zip: text });
  } else {
    this.propertyForm.patchValue({ address: text });
  }
  this.searchText = '';
  this.scrollToForm();
}

// CREATE and UPDATE share one Save button.
onSubmit(){

   if (this.propertyForm.invalid) {
    this.propertyForm.markAllAsTouched();
    return;
  }

  const formValue = this.propertyForm.getRawValue();
  const property: Partial<Property> = {
    ...formValue,
    rentPrice: Number(formValue.rentPrice),
    // Unchecked boxes come back as null after a form reset; store them as false.
    amenities: Object.fromEntries(Object.entries(formValue.amenities).map(([k, v]) => [k, !!v])) as unknown as Amenities,
    beds: Number(formValue.beds),
    baths: Number(formValue.baths),
  } as Partial<Property>;

  if (this.editingId === null) {
    this.propertyService.createProperty(property).subscribe({
      next: () => {
        this.message = formValue.address + ' was added.';
        this.loadProperties();
      },
      error: err => this.showError(err)
    });
  } else {
    this.propertyService.updateProperty(this.editingId, property).subscribe({
      next: () => {
        this.message = formValue.address + ' was updated.';
        this.loadProperties();
      },
      error: err => this.showError(err)
    });
  }

  this.editingId = null;
  this.showForm = false;
  this.propertyForm.reset();
}

// Edit button on the Property Details page opens /properties?edit=<id>
private openEditFromDetails() {
  const id = this.route.snapshot.queryParamMap.get('edit');
  const property = this.properties.find(p => p._id === id);
  if (property) {
    this.editProperty(property);
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }
}

// Edit: load the selected property into the form.
// Numbers are turned back into strings so the dropdowns select the right option.
editProperty(property: Property) {
  this.editingId = property._id ?? null;
  this.propertyForm.setValue({
    address: property.address,
    city: property.city,
    state: property.state,
    zip: property.zip,
    propertyType: property.propertyType,
    rentPrice: String(property.rentPrice),
    beds: String(property.beds),
    baths: String(property.baths),
    amenities: { ...property.amenities },
    landlord: property.landlord,
  });
  this.message = '';
  this.showForm = true;
  this.scrollToForm();
}

cancelEdit() {
  this.editingId = null;
  this.showForm = false;
  this.propertyForm.reset();
  this.message = '';
}

// DELETE (soft delete): archive after the user confirms, as in the user flow.
archiveProperty(property: Property) {
  if (!confirm('Archive ' + property.address + '?')) {
    return;
  }
  this.propertyService.updateProperty(property._id!, { isArchived: true }).subscribe(() => {
    if (this.editingId === property._id) {
      this.cancelEdit();
    }
    this.message = property.address + ' was archived.';
    this.loadProperties();
  });
}

restoreProperty(property: Property) {
  this.propertyService.updateProperty(property._id!, { isArchived: false }).subscribe(() => {
    this.message = property.address + ' was restored.';
    this.loadProperties();
  });
}

private showError(err: any) {
  this.message = 'Save failed: ' + (err?.error?.message ?? 'is the server running?');
  this.cdr.markForCheck();
}

}
