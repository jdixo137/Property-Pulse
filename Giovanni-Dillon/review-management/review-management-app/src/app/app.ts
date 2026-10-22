import { Component } from '@angular/core';
import { ReviewManagement } from './review-management/review-management';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReviewManagement],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'review-management';
}