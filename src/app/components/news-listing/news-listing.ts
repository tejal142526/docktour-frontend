import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { CommonModule } from '@angular/common';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Wpapi } from '../../Services/Services/wpapi';
import { Pagination } from '../../comman/pagination/pagination';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare const AOS: any;

@Component({
  selector: 'app-news-listing',
  imports: [Breadcrumb, CommonModule, Pagination, RouterLink, FormsModule],
  templateUrl: './news-listing.html',
  styleUrl: './news-listing.css',
  host: {
    ngSkipHydration: ''
  }
})
export class NewsListing implements AfterViewInit, OnInit, OnDestroy {
  Destroy$ = new Subject<void>();
  newsList: Array<any> = [];
  category: Array<any> = [];
  newsType: Array<any> = [];
  sleectedType: any = [];

    isOpen = false;


  perPage: number = 6;
  orderBy: string = 'date';
  order: string = 'desc';
  currentPage: number = 1;
  totalPages: number = 1;

  selectedCategory = '';
  selectedType: Array<any> = [];

  constructor(private wpapi: Wpapi, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getNewsTaxonmy();
    this.getNewsList();
  }

  ngAfterViewInit(): void {
    this.aosview();
  }

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();
  }

  aosview() {
    AOS.init({ duration: 1200, once: true });
    setTimeout(() => AOS.refresh(), 400);
  }

  OnPageChange(e: any) {
    this.currentPage = e;
    this.getNewsList();
  }

  OnSort(evt: Event) {
    let selected = (evt.target as HTMLSelectElement).value;
    let value = selected.split('-');
    this.orderBy = value[0];
    this.order = value[1];
    this.currentPage = 1;
    this.getNewsList();
  }

  OnCategoryChange(e: Event) {
    this.selectedCategory = (e.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getNewsList();
  }
  
  OnTypeChange(evt: Event, item: any) {
    let checkedData = evt.target as HTMLInputElement;
    if (checkedData.checked) {
      this.selectedType.push(item.id);
    } else {
      this.selectedType = this.selectedType.filter((val) => val != item.id);
    }
    this.currentPage = 1;
    this.getNewsList()
  }

  getNewsList() {
    let newsCategory = this.selectedCategory;
    let newsType = this.selectedType.join(',')
    this.wpapi
      .getLatestNewsPosts(this.currentPage, this.perPage, this.orderBy, this.order, newsCategory, newsType )
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (!res.body) this.newsList = [];
          this.newsList = res?.body || [];
           this.totalPages = Number(res?.headers?.get('X-WP-TotalPages'));
          console.log(res);
        },
      });
  }

  getNewsTaxonmy() {
    let newsCategoryApi = this.wpapi.getTaxonomies('news-category');
    let newsTypeApi = this.wpapi.getTaxonomies('news_post_type');

    forkJoin([newsCategoryApi, newsTypeApi])
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: ([newsCategory, newsType]) => {
          this.category = newsCategory || [];
          this.newsType = newsType || [];
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.renderer.addClass(document.body, 'active');
    } else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
}
