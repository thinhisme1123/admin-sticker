import { Injectable,signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StickerCategoryService {
  private readonly baseUrl = environment.apiUrl;
  private readonly token = environment.apiToken;


  constructor() {}
}
