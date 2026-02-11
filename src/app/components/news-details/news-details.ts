import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

import Swiper from 'swiper';
import { ActivatedRoute, RouterLink } from '@angular/router';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Subject, takeUntil } from 'rxjs';
import { Wpapi } from '../../Services/Services/wpapi';
import { Title } from '@angular/platform-browser';

declare const AOS: any;

@Component({
  selector: 'app-news-details',
  imports: [Breadcrumb, CommonModule,],
  templateUrl: './news-details.html',
  styleUrl: './news-details.css',
  host: {
    ngSkipHydration: '',
  },
})
export class NewsDetails implements OnInit, AfterViewInit, OnDestroy {
  Destroy$ = new Subject<void>();
  newsSwiper: any;
  
  fbShareLink = '';
  linkedInShareLink = '';
  shareURL: string = '';
  data: any = {};
  currentNewsType: string = '';
  currentNewsCategory: string = '';
  newsTitle: string = '';

  recommendedNews: Array<any> = [];
  maxSuggestions: number = 6;

  // Data loading flags
  newsDetailsLoaded = false;
  recommendedNewsLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private wpapi: Wpapi,
    private activatedRoute: ActivatedRoute,
    private title: Title
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.shareURL = encodeURIComponent(window.location.href);
    }
    
    this.activatedRoute.paramMap.subscribe((res) => {
      let slug = res.get('slug') || '';
      
      // Reset data when slug changes
      this.resetData();
      this.getNewsDetails(slug);
    });
  }

  ngOnInit() {
    this.fbShareLink = `https://www.facebook.com/sharer/sharer.php?u=${this.shareURL}`;
    this.linkedInShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${this.shareURL}`;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    
    this.aosview();
    
    // Wait for data to load before initializing slider
    this.checkDataAndInitialize();
  }

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();
    
    // Destroy Swiper instance
    if (this.newsSwiper) {
      this.newsSwiper.destroy(true, true);
      this.newsSwiper = null;
    }
  }

  resetData() {
    this.newsDetailsLoaded = false;
    this.recommendedNewsLoaded = false;
    this.data = {};
    this.recommendedNews = [];
    
    // Destroy existing swiper
    if (this.newsSwiper) {
      this.newsSwiper.destroy(true, true);
      this.newsSwiper = null;
    }
  }

checkDataAndInitialize() {
  let checkCount = 0;
  let isInitialized = false;
  
  const checkInterval = setInterval(() => {
    checkCount++;
    
    if (!isInitialized && this.newsDetailsLoaded && this.recommendedNewsLoaded && this.recommendedNews.length > 0) {
      isInitialized = true;
      clearInterval(checkInterval);
      clearTimeout(timeoutId); // Clear the timeout when data loads
      setTimeout(() => {
        this.initializeSlider();
      }, 300);
    }
  }, 100);

  // Timeout after 5 seconds
  const timeoutId = setTimeout(() => {
    if (!isInitialized) {
      clearInterval(checkInterval);
      if (this.recommendedNews.length > 0) {
        console.warn('⚠️ Data loading timeout, initializing anyway');
        isInitialized = true;
        this.initializeSlider();
      } else {
        console.log('ℹ️ No recommended news to show');
      }
    } else {
      clearInterval(checkInterval);
    }
  }, 5000);
}

  initializeSlider() {
    // Check if already initialized
    if (this.newsSwiper) {
      this.newsSwiper.destroy(true, true);
      this.newsSwiper = null;
    }

    if (this.recommendedNews.length === 0) {
      console.log('ℹ️ No slides to initialize');
      return;
    }

    this.initNewsSwiper();
  }

  getNewsDetails(slug: string) {
    this.wpapi
      .getNewsDetails(slug)
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (!res.length) {
            this.data = [];
            this.newsDetailsLoaded = true;
            return;
          }
          
          let data = res[0];
          this.data = data;
          this.newsTitle = data?.title?.rendered;
          this.currentNewsCategory = data?.['news-category']?.join(',') || '';
          this.currentNewsType = data?.['news_post_type']?.join(',') || '';
          
          console.log('📄 News Details:', this.data);
          
          this.newsDetailsLoaded = true;
          
          // Start loading recommendations
          this.getNewsCatSuggestion();
        },
        error: (err) => {
          console.error('❌ Error fetching news details:', err);
          this.newsDetailsLoaded = true;
        },
      });
  }

  getNewsCatSuggestion() {
    this.wpapi
      .getLatestNewsPosts(1, 6, 'date', 'desc', this.currentNewsCategory, '', this.data.id)
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.mergeUniqueSuggestions(res.body);
          }
          
          if (this.recommendedNews.length < this.maxSuggestions) {
            this.getNewsTypeSuggestion();
          } else {
            this.recommendedNewsLoaded = true;
            console.log('✅ Recommended news loaded (category):', this.recommendedNews.length);
          }
        },
        error: (err) => {
          console.error('❌ Error fetching category suggestions:', err);
          this.getNewsTypeSuggestion();
        },
      });
  }

  getNewsTypeSuggestion() {
    this.wpapi
      .getLatestNewsPosts(1, 6, 'date', 'desc', '', this.currentNewsType, this.data.id)
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.mergeUniqueSuggestions(res.body);
          }
          
          if (this.recommendedNews.length < this.maxSuggestions) {
            this.getLatestNewsSuggestions();
          } else {
            this.recommendedNewsLoaded = true;
            console.log('✅ Recommended news loaded (type):', this.recommendedNews.length);
          }
        },
        error: (err) => {
          console.error('❌ Error fetching type suggestions:', err);
          this.getLatestNewsSuggestions();
        },
      });
  }

  getLatestNewsSuggestions() {
    this.wpapi
      .getLatestNewsPosts(1, 6, 'date', 'desc', '', '', this.data.id)
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.mergeUniqueSuggestions(res.body);
          }
          this.recommendedNewsLoaded = true;
          console.log('✅ Recommended news loaded (latest):', this.recommendedNews.length);
          console.log( this.recommendedNews);
        },
        error: (err) => {
          console.error('❌ Error fetching latest suggestions:', err);
          this.recommendedNewsLoaded = true;
        },
      });
  }

  mergeUniqueSuggestions(arr: Array<any>) {
    arr.forEach((item) => {
      if (!this.recommendedNews.find((res) => item.id == res.id)) {
        if (this.recommendedNews.length < this.maxSuggestions) {
          this.recommendedNews.push(item);
        }
      }
    });
  }

  initNewsSwiper() {
    const sliderEl = document.querySelector('.newsSlider');
    
    if (!sliderEl) {
      console.error('❌ .newsSlider element not found');
      return;
    }

    const slides = sliderEl.querySelectorAll('.swiper-slide');
    if (slides.length === 0) {
      console.warn('⚠️ No slides found in .newsSlider');
      return;
    }

    console.log(`✅ Found ${slides.length} slides`);

    const paginationEl = sliderEl.querySelector('.news-pagination') as HTMLElement;

    // Remove old counter if exists
    const oldCounter = sliderEl.querySelector('.swiper-counter');
    if (oldCounter) oldCounter.remove();

    const counter = document.createElement('div');
    counter.className = 'swiper-counter';
    sliderEl.appendChild(counter);

    let sliderPerPage = 3;

    this.newsSwiper = new Swiper('.newsSlider', {
      modules: [Pagination, Navigation],
      slidesPerView: sliderPerPage,
      spaceBetween: 30,
      loop: false,
      speed: 900,
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
        0: { enabled: false, },
      
        768: { slidesPerView: 2,  enabled: true, },
        992: { slidesPerView: 3 },
      },
      on: {
        init: (swiper: any) => {
          console.log('✅ News Swiper initialized!');
          const current = String(1).padStart(2, '0');
          const total = String(swiper.slides.length - Math.floor(sliderPerPage - 1)).padStart(2, '0');
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
        slideChange: (swiper: any) => {
          const current = String(swiper.realIndex + 1).padStart(2, '0');
          const total = String(swiper.slides.length - Math.floor(sliderPerPage - 1)).padStart(2, '0');
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
      },
    });

    console.log('✅ Swiper instance created:', this.newsSwiper);
  }

  aosview() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 1200, once: true });
      setTimeout(() => AOS.refresh(), 400);
    }
  }
}