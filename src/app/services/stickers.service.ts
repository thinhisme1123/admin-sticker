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

  constructor(private readonly http: HttpClient) {}
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
    return this.http.delete(
      `${this.baseUrl}/BuiltInMessage?Id=${id}`,
      { headers }
    );
  }
} 
