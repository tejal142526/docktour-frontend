import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ContactFormData } from '../../components/contact-us/contact-us';

@Injectable({
  providedIn: 'root',
})
export class Wpapi {
  private apiUrl = 'wp-json/wp/v2';

  constructor(private apiservice: ApiService) {}

  getPages(): Observable<any[]> {
    return this.apiservice.get(`${this.apiUrl}/pages?_embed`);
  }

  // Get a single page by ID
  getPageDetailsById(id: number): Observable<any> {
    return this.apiservice.get(`${this.apiUrl}/pages${id}`);
  }

  getPageDetailsBySlug(slug: string): Observable<any> {
    return this.apiservice.get(`${this.apiUrl}/pages?slug=${slug}&_embed`);
  }

  getSearchedItems(query: string) {
    return this.apiservice.get(`${this.apiUrl}/pages?search=${query}&_embed`);
  }

  getLatestNewsPosts(
    pageNumber: Number,
    perPage: Number,
    orderBy = 'date',
    order = 'desc',
    cat = '',
    type = '',
    exclude = '',
  ): Observable<any> {
    const categoryParam =
      cat && cat != undefined && cat.length && cat !== '0' ? `&news-category=${cat}` : '';

    const newsType =
      type && type != undefined && type.length && type !== '0' ? `&news_post_type=${type}` : '';
    const excludeId =
      exclude && exclude != undefined && exclude !== '0' ? `&exclude=${exclude}` : '';

    return this.apiservice.get(
      `${this.apiUrl}/news?per_page=${perPage}&orderby=${orderBy}&order=${order}&page=${pageNumber}${categoryParam}${newsType}${excludeId}&_embed`,
      {
        observe: 'response',
        transferCache: {
          includeHeaders: ['X-WP-TotalPages', 'X-WP-Total'],
        },
      },
    );
  }

  getNewsDetails(slug: string) {
    return this.apiservice.get(`${this.apiUrl}/news?slug=${slug}&_embed`);
  }

  getSolutionList(): Observable<any> {
    return this.apiservice.get(`${this.apiUrl}/solutions?orderby=menu_order&order=asc&_embed`);
  }

  getLeadersList(): Observable<any> {
    return this.apiservice.get(`${this.apiUrl}/leaders?orderby=date&order=asc&_embed`);
  }

  getSectorsList(): Observable<any> {
    return this.apiservice.get(`${this.apiUrl}/sector?orderby=menu_order&order=asc&_embed`);
  }

  getStoriesList(
    pageNumber: Number,
    perPage: Number,
    orderBy = 'date',
    order = 'desc',
  ): Observable<any> {
    let perpageparam = perPage && perPage != 0 ? `&per_page=${perPage}` : '';
    return this.apiservice.get(
      `${this.apiUrl}/stories?orderby=${orderBy}&order=${order}&_embed${perpageparam}&page=${pageNumber}`,
      {
        observe: 'response',
        transferCache: {
          includeHeaders: ['X-WP-TotalPages', 'X-WP-Total'],
        },
      },
    );
  }
  getStoriesDetailsBySlug(slug: string): Observable<any> {
    return this.apiservice.get(`${this.apiUrl}/stories?slug=${slug}&_embed`)
  }

  getTaxonomies(taxonomyTerm: string) {
    return this.apiservice.get(`${this.apiUrl}/${taxonomyTerm}`);
  }

  submitContactForm(data: ContactFormData) {
    return this.apiservice.post(`${this.apiUrl}/contact/v1/submit`, data);
  }

  subscribeNewsLetter(data: any) {
    return this.apiservice.post(`${this.apiUrl}/newsletter/v1/subscribe`, data);
  }
}
