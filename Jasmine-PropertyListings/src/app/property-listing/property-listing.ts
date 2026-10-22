import { Component } from '@angular/core';
import { FormControl,FormGroup, ReactiveFormsModule  } from '@angular/forms';
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-property-listing',
  styleUrl: './property-listing.css',
  templateUrl: './property-listing.html',
})
export class propertyListing {Propertyform = new FormGroup({
   address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
    propertyType: new FormControl(''),
    rentPrice: new FormControl(''),
    beds: new FormControl(''),
    baths: new FormControl(''),
    amentites: new FormControl(''),
    landlord: new FormControl(''),

})}
