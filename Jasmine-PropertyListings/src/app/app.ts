import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {propertyListing } from './property-listing/property-listing';


@Component({
  imports: [RouterOutlet, propertyListing],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('property-pulse');
}

