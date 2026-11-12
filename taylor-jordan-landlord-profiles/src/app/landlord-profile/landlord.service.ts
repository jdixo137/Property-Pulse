import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Landlord {
  _id?: string;
  landlordName: string;
  email: string;
  phone: string;
  propertiesOwned: number;
  averageRating: number;
  totalReviews: number;
  isArchived: boolean;
}

@Injectable({ providedIn: 'root' })
export class LandlordService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/landlords';

  getLandlords(): Observable<Landlord[]> {
    return this.http.get<Landlord[]>(this.apiUrl);
  }

  createLandlord(landlord: Partial<Landlord>): Observable<Landlord> {
    return this.http.post<Landlord>(this.apiUrl, landlord);
  }

  updateLandlord(id: string, changes: Partial<Landlord>): Observable<Landlord> {
    return this.http.put<Landlord>(`${this.apiUrl}/${id}`, changes);
  }
}