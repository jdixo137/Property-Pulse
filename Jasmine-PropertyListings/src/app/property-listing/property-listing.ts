import { Component } from '@angular/core';
import { FormControl,FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';

// Shape of one saved property. The fields match the form controls,
// plus an id and an isArchived flag for the soft delete (Archive Property).
export interface Amenities {
  dishwasher: boolean | null;
  basement: boolean | null;
  fireplace: boolean | null;
  laundry: boolean | null;
  closet: boolean | null;
  hardwood: boolean | null;
  pool: boolean | null;
  porch: boolean | null;
  deck: boolean | null;
  gated: boolean | null;
  playground: boolean | null;
}

export interface Property {
  id: number;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  propertyType: string | null;
  rentPrice: string | null;
  beds: string | null;
  baths: string | null;
  amenities: Amenities;
  landlord: string | null;
  isArchived: boolean;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-property-listing',
  styleUrl: './property-listing.css',
  templateUrl: './property-listing.html',
})
export class PropertyListing {propertyForm = new FormGroup({
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

// Properties are kept in this array until the MongoDB service is added.
properties: Property[] = [];
nextId = 1;

// null = Add mode, a number = the id of the property being edited.
editingId: number | null = null;

showArchived = false;
message = '';

// Landlord names for the table, matching the dropdown options.
landlordNames: { [id: string]: string } = {
  '1': 'Tony Stark',
  '2': 'Peter Parker',
  '3': 'Mark Banner',
};

// Read: active properties, plus archived ones when Show Archived is checked.
get visibleProperties(): Property[] {
  return this.properties.filter(p => this.showArchived || !p.isArchived);
}

// Create and Update share one Save button.
onSubmit(){

   if (this.propertyForm.invalid) {
    this.propertyForm.markAllAsTouched();
    return;
  }

  const formValue = this.propertyForm.getRawValue();

  if (this.editingId === null) {
    // Create
    this.properties.push({ id: this.nextId++, ...formValue, isArchived: false });
    this.message = formValue.address + ' was added.';
  } else {
    // Update
    const property = this.properties.find(p => p.id === this.editingId);
    if (property) {
      Object.assign(property, formValue);
    }
    this.message = formValue.address + ' was updated.';
  }

  this.editingId = null;
  this.propertyForm.reset();
}

// Edit: load the selected property into the form.
editProperty(property: Property) {
  this.editingId = property.id;
  const { id, isArchived, ...values } = property;
  this.propertyForm.setValue(values);
  this.message = '';
}

cancelEdit() {
  this.editingId = null;
  this.propertyForm.reset();
}

// Delete: soft delete after the user confirms (Archive property? in the user flow).
archiveProperty(property: Property) {
  if (!confirm('Archive ' + property.address + '?')) {
    return;
  }
  property.isArchived = true;
  if (this.editingId === property.id) {
    this.cancelEdit();
  }
  this.message = property.address + ' was archived.';
}

restoreProperty(property: Property) {
  property.isArchived = false;
  this.message = property.address + ' was restored.';
}

}
