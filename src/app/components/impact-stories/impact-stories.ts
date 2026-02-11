import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { CommonModule } from '@angular/common';
import { Wpapi } from '../../Services/Services/wpapi';
import { Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../comman/pagination/pagination';
import Swiper from 'swiper';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import { RouterLink } from "@angular/router";

declare const AOS: any;

@Component({
  selector: 'app-impact-stories',
  imports: [Breadcrumb, CommonModule, Pagination, RouterLink],
  templateUrl: './impact-stories.html',
  styleUrl: './impact-stories.css',
  host: {
    ngSkipHydration: '',
  },
})
export class ImpactStories implements OnInit, AfterViewInit, OnDestroy {
  selectedData: any;
  Destory$ = new Subject<void>();
  pageData: any = {};
  storiesList: Array<any> = [];
  totalPages: number = 0;
  currentPage: number = 1;
  orderBy: string = 'date';
  order: string = 'desc';
  perPageData: Number = 6;

  // Swiper instance
  programSwiper: any;

  // Data loading flags
  pageDataLoaded = false;
  storiesListLoaded = false;

  constructor(private wpapi: Wpapi) {}

  ngOnInit(): void {
    this.getStoryPage();
    this.getStoriesList();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.aosview();

    // Wait for data to load before initializing slider
    this.checkDataAndInitialize();
  }

  ngOnDestroy(): void {
    this.Destory$.next();
    this.Destory$.complete();

    // Destroy Swiper instance
    if (this.programSwiper) {
      this.programSwiper.destroy(true, true);
      this.programSwiper = null;
    }
  }

  checkDataAndInitialize() {
    // Check if data is loaded
    const checkInterval = setInterval(() => {
      if (this.pageDataLoaded && this.storiesListLoaded) {
        clearInterval(checkInterval);
        setTimeout(() => {
          this.initializeSlider();
        }, 300);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!this.pageDataLoaded || !this.storiesListLoaded) {
        console.warn('Data not fully loaded, initializing slider anyway');
        this.initializeSlider();
      }
    }, 5000);
  }

  initializeSlider() {
    // Check if already initialized
    if (this.programSwiper) {
      console.warn('Slider already initialized, destroying and recreating');
      this.programSwiper.destroy(true, true);
      this.programSwiper = null;
    }

    this.programSlider();
  }

  OnPageChange(e: any) {
    this.currentPage = e;
    this.getStoriesList(e);
  }

  getStoryPage() {
    this.wpapi
      .getPageDetailsBySlug('impact-stories')
      .pipe(takeUntil(this.Destory$))
      .subscribe({
        next: (res) => {
          if (!res) {
            this.pageDataLoaded = true;
            return;
          }
          let Data = res?.[0] || [];
          this.pageData = Data?.acf_fields;
          console.log('Story Page Data:', this.pageData);
          this.pageDataLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching story page:', err);
          this.pageDataLoaded = true; // Set to true to not block initialization
        },
      });
  }

  programSlider() {
    const sliderEl: HTMLElement | null = document.querySelector('.newsSlider');

    if (!sliderEl) {
      console.warn('.newsSlider element not found');
      return;
    }

    const slides = sliderEl.querySelectorAll('.swiper-slide');
    if (slides.length === 0) {
      console.warn('No slides found in .newsSlider');
      return;
    }

    const paginationEl = sliderEl.querySelector('.news-pagination') as HTMLElement;

    // Remove old counter if exists
    const oldCounter = sliderEl.querySelector('.swiper-counter');
    if (oldCounter) {
      oldCounter.remove();
    }

    const counter = document.createElement('div');
    counter.className = 'swiper-counter';
    sliderEl.appendChild(counter);

    let sliderPerPage = 2.5;

    this.programSwiper = new Swiper(sliderEl, {
      modules: [SwiperPagination, Navigation],
      slidesPerView: sliderPerPage,
      spaceBetween: 20,
      speed: 900,
      watchSlidesProgress: true,
      slidesOffsetAfter: 20,
      centerInsufficientSlides: true,
      observer: true,
      observeParents: true,
      pagination: {
        el: paginationEl,
        clickable: true,
        type: 'bullets',
      },
      navigation: {
        nextEl: '.news-next',
        prevEl: '.news-prev',
      },
      breakpoints: {
         0: { slidesPerView: 1 },
            576: { slidesPerView: 1 },
            768: { slidesPerView: 1.5 },
            992: { slidesPerView: 1.5 },
            1024: { slidesPerView: 2.5 },
      },
      on: {
        init: (swiper: any) => {
           const slidesPerView = swiper.slidesPerViewDynamic();

          setTimeout(() => swiper.update(), 50);
          const total = String(swiper.slides.length - Math.floor(slidesPerView - 1)).padStart(
            2,
            '0',
          );
          counter.innerHTML = `<span class="current-slide">01</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
        slideChange: (swiper: any) => {
           const slidesPerView = swiper.slidesPerViewDynamic();

          const current = String(swiper.realIndex + 1).padStart(2, '0');
          const total = String(swiper.slides.length - Math.floor(slidesPerView - 1)).padStart(
            2,
            '0',
          );
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
        resize: (swiper: any) => {
          setTimeout(() => swiper.update(), 50);
        },
      },
    });
  }

  getStoriesList(
    pageNumber = 1,
    perPageData: Number = this.perPageData,
    orderBy: string = this.orderBy,
    order: string = this.order,
  ) {
    // Set loading state
    this.storiesListLoaded = false;

    this.wpapi
      .getStoriesList(pageNumber, perPageData, orderBy, order)
      .pipe(takeUntil(this.Destory$))
      .subscribe({
        next: (res) => {
          if (!res) {
            this.storiesListLoaded = true;
            return;
          }
          let Data = res.body || [];
          this.storiesList = Data;
          console.log('Stories List:', Data);
          this.totalPages = Number(res?.headers?.get('X-WP-TotalPages'));
          this.storiesListLoaded = true;

          // Reinitialize slider after data changes (for pagination/sorting)
          if (pageNumber !== 1 || orderBy !== 'date' || order !== 'desc') {
            setTimeout(() => {
              if (this.programSwiper) {
                this.programSwiper.destroy(true, true);
                this.programSwiper = null;
              }
              this.programSlider();
            }, 100);
          }
        },
        error: (err) => {
          console.error('Error fetching story list:', err);
          this.storiesListLoaded = true; // Set to true to not block initialization
        },
      });
  }

  OnSort(event: any) {
    let selectedSort: string = (event.target as HTMLSelectElement).value;
    let value = selectedSort.split('-');
    this.orderBy = value[0];
    this.order = value[1];
    this.currentPage = 1;
    this.getStoriesList(1, this.perPageData, this.orderBy, this.order);
  }

  aosview() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 1200, once: true });
      setTimeout(() => AOS.refresh(), 400);
    }
  }

  openModal(data: any): void {
    this.selectedData = data;
  }
}
