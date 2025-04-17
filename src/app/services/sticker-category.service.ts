import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BuildInMessageCategory } from '../models/BuildInMessageCategory';
import { Observable, map } from 'rxjs';
import { BuildInMessage } from '../models/BuildInMessage';

@Injectable({
  providedIn: 'root',
})
export class StickerCategoryService {
  private readonly baseUrl = environment.apiUrl;
  private readonly token = environment.apiToken;

  readonly _categories = signal<BuildInMessageCategory[]>([]);
  categories = this._categories.asReadonly();

  constructor(private readonly http: HttpClient) {}

  // [GET] : fetch all sticker category
  fetchCategories(): Promise<any[]> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return new Promise((resolve, reject) => {
      this.http
        .get<any[]>(
          `${this.baseUrl}/BuiltInMessageCategory/get-builtin-message-categories`,
          { headers }
        )
        .subscribe({
          next: (data) => {
            this._categories.set(data);
            console.log(data);

            resolve(data);
          },
          error: (err) => {
            console.error('Error fetching categories ❌', err);

            reject(err);
          },
        });
    });
  }
  // [POST] : create new sticker category
  createNewStickerCategory(data: BuildInMessageCategory) {
    const headers = {
      Authorization: this.token,
    };
    return this.http.post(`${this.baseUrl}/BuiltInMessageCategory`, data, {
      headers,
    });
  }
  // [DELETE] : delete sticker category by id
  //waiting
  deleteStickerCategory(id: string) {
    const headers = {
      Authorization: this.token,
    };
    console.log(id);

    return this.http.delete(
      `${this.baseUrl}/BuiltInMessageCategory/?Id=${id}`,
      { headers }
    );
  }
  // [GET] : get sticker category detail
  getStickerCategoryDetail(id: string) {
    const headers = {
      Authorization: this.token,
    };
    return this.http.get<any>(
      `${this.baseUrl}/BuiltInMessageCategory/get-builtin-message-category-by-id?Id=${id}`,
      {
        headers,
      }
    );
  }
  // [PUT] : update sticker category 
  updateSticker(data: any) {
    const headers = {
      Authorization: this.token,
    };
    return this.http.put<any>(
      `${this.baseUrl}/BuiltInMessageCategory`,
      data,
      {
        headers,
      }
    );
  }

}
