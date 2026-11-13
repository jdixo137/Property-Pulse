import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../services/review.service';

interface Review {
  id: string;
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

export class ReviewManagement implements OnInit {

  reviewForm: FormGroup;

  reviews: Review[] = [];

  editingReviewId: string | null = null;

  // Set when the user came from a property's "Write a Review" button
  returnToProperty: string | null = null;

  constructor(
  private fb: FormBuilder,
  private reviewService: ReviewService,
  private cdr: ChangeDetectorRef,
  private route: ActivatedRoute,
  private router: Router
) {
    this.reviewForm = this.fb.group({
      propertyId: ['', Validators.required],
      username: ['', Validators.required],
      overallRating: [5, Validators.required],
      maintenanceRating: [5, Validators.required],
      communicationRating: [5, Validators.required],
      conditionRating: [5, Validators.required],
      valueRating: [5, Validators.required],
      moveRating: [5, Validators.required],
      reviewText: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadReviews();

    // Integration: "Write a Review" on Property Details opens /reviews?property=<id>
    const propertyId = this.route.snapshot.queryParamMap.get('property');
    if (propertyId) {
      this.reviewForm.patchValue({ propertyId });
      this.returnToProperty = propertyId;
    }
  }

  // READ
  loadReviews(): void {
  this.reviewService.getReviews().subscribe({
    next: (data: any[]) => {
      this.reviews = data.map(review => ({
        ...review,
        id: review._id
      }));

      this.cdr.markForCheck();
    },
    error: (error) => {
      console.error('Error loading reviews:', error);
    }
  });
}

  // CREATE AND UPDATE
  submitReview(): void {

    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const formValue = this.reviewForm.getRawValue();

    if (this.editingReviewId !== null) {

      this.reviewService.updateReview(
        this.editingReviewId,
        formValue
      ).subscribe({
        next: () => {
          this.loadReviews();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating review:', error);
        }
      });

    } else {

      this.reviewService.addReview(formValue).subscribe({
        next: () => {
          // Integration: go back to the property so the new review shows there
          if (this.returnToProperty) {
            this.router.navigate(['/properties', this.returnToProperty]);
            return;
          }
          this.loadReviews();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error submitting review:', error);
        }
      });

    }
  }

  // EDIT
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

  // DELETE
  deleteReview(id: string): void {

    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.loadReviews();

        if (this.editingReviewId === id) {
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Error deleting review:', error);
      }
    });
  }

  // RESET FORM
  resetForm(): void {

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

  cancelEdit(): void {
    this.resetForm();
  }
}