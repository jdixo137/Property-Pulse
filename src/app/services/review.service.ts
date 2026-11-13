import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addReview(review: any): Observable<any> {
    return this.http.post(this.apiUrl, review);
  }

  updateReview(id: string, review: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}