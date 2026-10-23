import { Component } from '@angular/core';
import { FormControl,FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-property-listing',
  styleUrl: './property-listing.css',
  templateUrl: './property-listing.html',
})
export class PropertyListing {propertyForm = new FormGroup({
   address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]),
    propertyType: new FormControl('', [Validators.required]),
    rentPrice: new FormControl('', [Validators.required, Validators.min(100)]),
    beds: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    amenities: new FormGroup({
      dishwasher: new FormControl(false),
      basement: new FormControl(false),
      fireplace: new FormControl(false),
      laundry: new FormControl(false),
      closet: new FormControl(false),
      hardwood: new FormControl(false),
      pool: new FormControl(false),
      porch: new FormControl(false),
      deck: new FormControl(false),
      gated: new FormControl(false),
      playground: new FormControl(false),
    }),
    landlord: new FormControl('', [Validators.required]),
});

get address() {
  return this.propertyForm.get('address');
}

get city() {
  return this.propertyForm.get('city');
}

get state() {
  return this.propertyForm.get('state');
}

get zip() {
  return this.propertyForm.get('zip');
}

get propertyType() {
  return this.propertyForm.get('propertyType');
}

get rentPrice() {
  return this.propertyForm.get('rentPrice');
}

get beds() {
  return this.propertyForm.get('beds');
}

get baths() {
  return this.propertyForm.get('baths');
}

get landlord() {
  return this.propertyForm.get('landlord');
}

onSubmit(){

   if (this.propertyForm.invalid) {
    this.propertyForm.markAllAsTouched();
    return;
  }
  
  console.log(this.propertyForm.value);

  this.propertyForm.reset();
}

}
