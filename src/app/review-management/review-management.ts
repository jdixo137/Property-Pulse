import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Review {
  id: number;
  propertyId: string;
  username: string;
  overallRating: number;
  maintenanceRating: number;
  communicationRating: number;
  conditionRating: number;
  valueRating: number;
  moveRating: number;
  reviewText: string;
  submissionDate: string;
}

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-management.html',
  styleUrl: './review-management.css'
})
export class ReviewManagement {
  reviewForm: FormGroup;

  reviews: Review[] = [];

  editingReviewId: number | null = null;

  nextReviewId = 1;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      propertyId: ['', Validators.required],
      username: ['', Validators.required],
      overallRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      maintenanceRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      communicationRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      conditionRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      valueRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      moveRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const formValue = this.reviewForm.getRawValue();

    if (this.editingReviewId !== null) {
      this.reviews = this.reviews.map(review =>
        review.id === this.editingReviewId
          ? {
              ...review,
              ...formValue
            }
          : review
      );

      this.editingReviewId = null;
    } else {
      const newReview: Review = {
        id: this.nextReviewId++,
        ...formValue,
        submissionDate: new Date().toLocaleDateString()
      };

      this.reviews = [...this.reviews, newReview];
    }

    this.reviewForm.reset({
      propertyId: '',
      username: '',
      overallRating: 5,
      maintenanceRating: 5,
      communicationRating: 5,
      conditionRating: 5,
      valueRating: 5,
      moveRating: 5,
      reviewText: ''
    });
  }

  editReview(review: Review): void {
    this.editingReviewId = review.id;

    this.reviewForm.patchValue({
      propertyId: review.propertyId,
      username: review.username,
      overallRating: review.overallRating,
      maintenanceRating: review.maintenanceRating,
      communicationRating: review.communicationRating,
      conditionRating: review.conditionRating,
      valueRating: review.valueRating,
      moveRating: review.moveRating,
      reviewText: review.reviewText
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteReview(id: number): void {
    this.reviews = this.reviews.filter(review => review.id !== id);

    if (this.editingReviewId === id) {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingReviewId = null;

    this.reviewForm.reset({
      propertyId: '',
      username: '',
      overallRating: 5,
      maintenanceRating: 5,
      communicationRating: 5,
      conditionRating: 5,
      valueRating: 5,
      moveRating: 5,
      reviewText: ''
    });
  }
}
