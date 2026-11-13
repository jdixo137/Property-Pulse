import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Temporary Reviews page. Giovanni's Review Management component replaces this
// once it is connected to MongoDB (swap the 'reviews' route in app.routes.ts).
@Component({
  imports: [RouterLink],
  selector: 'app-reviews-placeholder',
  template: `
    <section class="card placeholder">
      <h2>Reviews</h2>
      <p>Review Management is coming soon. Renters will be able to rate and review properties and landlords here.</p>
      <a routerLink="/properties" class="btn btn-secondary">Back to Property Listings</a>
    </section>
  `,
  styles: `
    .placeholder { text-align: center; padding: 48px 24px; }
    .placeholder p { color: var(--color-muted); margin-bottom: 24px; }
    a.btn { text-decoration: none; display: inline-block; }
  `,
})
export class ReviewsPlaceholder {}
