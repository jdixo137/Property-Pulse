import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PropertyService } from './property-listing/property.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected propertyService = inject(PropertyService);
  private router = inject(Router);

  // True while the user left an unfinished property form to add a landlord.
  get hasPropertyDraft(): boolean {
    return this.propertyService.draft !== null && !this.router.url.startsWith('/properties');
  }
}
