import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Amenities {
  dishwasher: boolean;
  basement: boolean;
  fireplace: boolean;
  laundry: boolean;
  closet: boolean;
  hardwood: boolean;
  pool: boolean;
  porch: boolean;
  deck: boolean;
  gated: boolean;
  playground: boolean;
}

// One property document from the MongoDB Properties collection.
export interface Property {
  _id?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  rentPrice: number;
  beds: number;
  baths: number;
  amenities: Amenities;
  landlord: string; // the landlord's _id from the Landlords collection
  isArchived: boolean;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/properties';

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  updateProperty(id: string, changes: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, changes);
  }
}
