import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BuildInMessageCategory } from '../models/BuildInMessageCategory';
import { Observable, map } from 'rxjs';
import { BuildInMessage } from '../models/BuildInMessage';
@Injectable({
  providedIn: 'root',
})
export class StickersService {
  private readonly baseUrl = environment.apiUrl;
  private readonly token = environment.apiToken;
  private readonly uploadUrl = `${this.baseUrl}/FileExplorer/upload-file`;

  readonly _categories = signal<BuildInMessageCategory[]>([]);
  categories = this._categories.asReadonly();

  constructor(private http: HttpClient) {}

  // [GET] : fetch all sticker
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
  createNewStickerCategory(data  : BuildInMessageCategory) {
    const headers = {
      Authorization: this.token,
    };
    return this.http.post(`${this.baseUrl}/BuiltInMessageCategory`, data, { headers });
  }

  // [DELETE] : delete sticker category by id
  //waiting
  deleteSticker(id: string) {
    const headers = {
      Authorization: this.token,
    };
    console.log(id);

    return this.http.delete(
      `${environment.apiUrl}/BuiltInMessageCategory/?Id=${id}`,
      { headers }
    );
  }
  // [GET] : get sticker detail
  getStickerDetail(id: string) {
    const headers = {
      Authorization: this.token,
    };
    return this.http.get<any>(
      `${environment.apiUrl}/BuiltInMessageCategory/get-builtin-message-category-by-id?Id=${id}`,
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
      `${environment.apiUrl}/BuiltInMessageCategory`,
      data,
      {
        headers,
      }
    );
  }
  // [POST] : upload sticker file to firebase ( png, jpg, gif)
  uploadStickerFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('File', file);

    const headers = new HttpHeaders({
      Authorization: this.token, 
    });

    return this.http
      .post<{ path?: string; filePath?: string }>(this.uploadUrl, formData, {
        headers,
      })
      .pipe(map((res) => res?.path || res?.filePath || ''));
  }
  // [POST] : create new buildInMessage of buildmessagecategory
  // tách ra 1 file service mới của category và sticker
  createNewBuildInMessage(data : object): Observable<BuildInMessage>{
    const headers = new HttpHeaders({
      Authorization: this.token, 
    });

    return this.http.post<BuildInMessage>(`${environment.apiUrl}/BuiltInMessage`, data, {headers})
  }
  // [DELETE] : delete  buildInMessage (sticker)
  deleteBuildInMessage(id: string) {
    const headers = {
      Authorization: this.token,
    };
    console.log(id);
    return this.http.delete(
      `${this.baseUrl}/BuiltInMessage?Id=${id}`,
      { headers }
    );
  }
} 
