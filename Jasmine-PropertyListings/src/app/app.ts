import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PropertyListing } from './property-listing/property-listing';


@Component({
  imports: [RouterOutlet, PropertyListing],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('property-pulse');
}

