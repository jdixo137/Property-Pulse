import { Component, signal } from '@angular/core';
import { LandlordProfile } from './landlord-profile/landlord-profile';

@Component({
  imports: [LandlordProfile],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('landlord-profiles');
}
