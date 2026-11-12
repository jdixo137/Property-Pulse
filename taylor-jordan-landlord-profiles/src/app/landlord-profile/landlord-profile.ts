import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Landlord, LandlordService } from './landlord.service';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-landlord-profile',
  styleUrl: './landlord-profile.css',
  templateUrl: './landlord-profile.html',
})
export class LandlordProfile implements OnInit {
  private landlordService = inject(LandlordService);
  private cdr = inject(ChangeDetectorRef);

  landlords: Landlord[] = [];
  editingId: string | null = null;
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

  ngOnInit() {
    this.loadLandlords();
  }

  // READ: get all landlords from MongoDB
  loadLandlords() {
    this.landlordService.getLandlords().subscribe({
      next: data => {
        this.landlords = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.message = 'Could not load landlords. Is the server running?';
        this.cdr.markForCheck();
      }
    });
  }

  // CREATE and UPDATE
  onSubmit() {
    const formValue = this.landlordForm.getRawValue();

    if (this.editingId === null) {
      this.landlordService.createLandlord(formValue).subscribe(() => {
        this.message = formValue.landlordName + ' was added.';
        this.loadLandlords();
      });
    } else {
      this.landlordService.updateLandlord(this.editingId, formValue).subscribe(() => {
        this.message = formValue.landlordName + ' was updated.';
        this.loadLandlords();
      });
    }

    this.editingId = null;
    this.landlordForm.reset();
  }

  editLandlord(landlord: Landlord) {
    this.editingId = landlord._id ?? null;
    this.landlordForm.setValue({
      landlordName: landlord.landlordName,
      email: landlord.email,
      phone: landlord.phone,
      propertiesOwned: landlord.propertiesOwned
    });
    this.message = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.landlordForm.reset();
    this.message = '';
  }

  // DELETE (soft delete): archive and restore
  archiveLandlord(landlord: Landlord) {
    this.landlordService.updateLandlord(landlord._id!, { isArchived: true }).subscribe(() => {
      this.message = landlord.landlordName + ' was archived.';
      this.loadLandlords();
    });
  }

  restoreLandlord(landlord: Landlord) {
    this.landlordService.updateLandlord(landlord._id!, { isArchived: false }).subscribe(() => {
      this.message = landlord.landlordName + ' was restored.';
      this.loadLandlords();
    });
  }

  get visibleLandlords(): Landlord[] {
    return this.landlords.filter(landlord => this.showArchived || !landlord.isArchived);
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