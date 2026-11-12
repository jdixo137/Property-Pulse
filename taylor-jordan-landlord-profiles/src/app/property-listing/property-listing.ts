import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Property, PropertyService } from './property.service';
import { Landlord, LandlordService } from '../landlord-profile/landlord.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-property-listing',
  styleUrl: './property-listing.css',
  templateUrl: './property-listing.html',
})
export class PropertyListing implements OnInit {
private propertyService = inject(PropertyService);
private landlordService = inject(LandlordService);
private cdr = inject(ChangeDetectorRef);
private router = inject(Router);

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

get visibleProperties(): Property[] {
  return this.properties.filter(p => this.showArchived || !p.isArchived);
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
  this.propertyForm.reset();
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
}

cancelEdit() {
  this.editingId = null;
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
