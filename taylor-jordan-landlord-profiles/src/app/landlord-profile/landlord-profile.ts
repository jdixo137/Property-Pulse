import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

export interface Landlord {
  landlordId: number;
  landlordName: string;
  email: string;
  phone: string;
  propertiesOwned: number;
  averageRating: number;
  totalReviews: number;
  isArchived: boolean;
}
@Component({
  imports: [ReactiveFormsModule,NgClass],
  selector: 'app-landlord-profile',
  styleUrl: './landlord-profile.css',
  templateUrl: './landlord-profile.html',
})
export class LandlordProfile {
landlords: Landlord[] = [
  {
    landlordId: 1,
    landlordName: 'Peachtree Properties',
    email: 'rentals@peachtreepg.com',
    phone: '404-444-4444',
    propertiesOwned: 10,
    averageRating: 4.0,
    totalReviews: 40,
    isArchived: false,
  },
  {
    landlordId:2,
    landlordName: 'Abigail Wilson',
    email: 'A.Wilson@gmail.com',
    phone: '404-555-5555',
    propertiesOwned: 5,
    averageRating: 5.0,
    totalReviews: 5,
    isArchived: false
  }
]
  nextId = 3;
  editingId: number | null = null;
  showArchived = false;
  message = '';

  landlordForm = new FormGroup({
    landlordName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)] }),
    propertiesOwned: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
  });

  get landlordName() { return this.landlordForm.controls.landlordName; }
  get email() { return this.landlordForm.controls.email; }
  get phone() { return this.landlordForm.controls.phone; }
  get propertiesOwned() { return this.landlordForm.controls.propertiesOwned; }

onSubmit() {
const formValue = this.landlordForm.getRawValue();
if (this.editingId === null) {
this.landlords.push({
landlordId: this.nextId++,
...formValue,
averageRating: 0,
totalReviews: 0,
isArchived: false
});
this.message = formValue.landlordName + ' was added.';
} else {
const landlord = this.landlords.find(l => l.landlordId ===
this.editingId);
if (landlord) {
Object.assign(landlord, formValue);
}
this.message = formValue.landlordName + ' was updated.';
}
this.editingId = null;
this.landlordForm.reset();
}
editLandlord(landlord: Landlord) {
    this.editingId = landlord.landlordId;
    this.landlordForm.setValue({
            landlordName: landlord.landlordName,
            email: landlord.email,
            phone: landlord.phone,
      propertiesOwned: landlord.propertiesOwned
    });
  }
  cancelEdit() {
    this.editingId = null;
    this.landlordForm.reset();
    this.message = '';
}
archiveLandlord(landlord: Landlord) {
landlord.isArchived = true;
this.message = landlord.landlordName + ' was archived.';
}
restoreLandlord(landlord: Landlord) {
landlord.isArchived = false;
this.message = landlord.landlordName + ' was restored.';
}
 get visibleLandlords(): Landlord[] {
return this.landlords.filter(landlord => this.showArchived ||!landlord.isArchived);
}
toggleArchived() {
this.showArchived = !this.showArchived;
}
getRatingClass(landlord: Landlord): string {
if (landlord.totalReviews === 0) return 'rating-none';
if (landlord.averageRating >= 4) return 'rating-high';
if (landlord.averageRating >= 3) return 'rating-mid';
return 'rating-low';
}
}