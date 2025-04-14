import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StickersService {
  private readonly baseUrl = environment.apiUrl;
  private readonly token = environment.apiToken;

  
  readonly _categories = signal<any[]>([]);
  categories = this._categories.asReadonly()

  constructor(private http: HttpClient) {}

  fetchCategories(): Promise<any[]> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
  
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`${this.baseUrl}/BuiltInMessageCategory/get-builtin-message-categories`, { headers })
        .subscribe({
          next: (data) => {
            this._categories.set(data);
            resolve(data);
          },
          error: (err) => {
            console.error('Error fetching categories ❌', err);
            reject(err);
          }
        });
    });
  }
}
