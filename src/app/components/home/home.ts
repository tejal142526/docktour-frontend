import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../Services/Services/api-service';
import { Wpapi } from '../../Services/Services/wpapi';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { RouterLink } from '@angular/router';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare const AOS: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  host: {
    ngSkipHydration: '',
  },
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  Destroy$ = new Subject<void>();

  data: Array<any> = [];
  acfFields: any;
  latestNews: Array<any> = [];
  sectorsList: Array<any> = [];
  caseStudyList: any = {};
  featuredSolutions: Array<any> = [];
  activeIndex = 0;
  selectedModalData: any = {};

  // Swiper instances
  newsSwiper: any;
  sectorSwiper: any;
  halfSwiper: any;
  mobileSwiper: any;
  scrollTriggerInstance: any;

  // Data loading flags
  pageDataLoaded = false;
  featuredSolutionsLoaded = false;
  sectorsLoaded = false;
  newsLoaded = false;
  caseStudyLoaded = false;

  constructor(
    private wpapi: Wpapi,
    private sanitizer: DomSanitizer,
  ) {}
  

  ngOnInit() {
    this.getPageDetails();
    this.getFeaturedSolutions();
    this.getSectorsList();
    this.getLatestNews();
    this.getCaseStudy();
  }
  currentSlide = 1;
totalSlides = 0;
@ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;

  ngAfterViewInit(): void {

    
    if (typeof window === 'undefined') return;

    // Wait a bit for data to load before initializing
    this.checkDataAndInitialize();


  }

  

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();
    this.destroyAllSwipers();
  }

  destroyAllSwipers() {
    if (this.newsSwiper) {
      this.newsSwiper.destroy(true, true);
      this.newsSwiper = null;
    }
    if (this.sectorSwiper) {
      this.sectorSwiper.destroy(true, true);
      this.sectorSwiper = null;
    }
    if (this.halfSwiper) {
      this.halfSwiper.destroy(true, true);
      this.halfSwiper = null;
    }
    if (this.mobileSwiper) {
      this.mobileSwiper.destroy(true, true);
      this.mobileSwiper = null;
    }
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
      this.scrollTriggerInstance = null;
    }

    // Kill all ScrollTriggers
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
  }

  checkDataAndInitialize() {
    // Check if critical data is loaded
    const checkInterval = setInterval(() => {
      if (this.sectorsLoaded && this.newsLoaded) {
        clearInterval(checkInterval);
        setTimeout(() => {
          this.initializeAllComponents();
        }, 300);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!this.sectorsLoaded || !this.newsLoaded) {
        console.warn('Data not fully loaded, initializing anyway');
        this.initializeAllComponents();
      }
    }, 5000);
  }

  initializeAllComponents() {
    if (typeof window === 'undefined') return;

    // Initialize AOS first
    this.initAOS();

    // Check if already initialized
    if (this.newsSwiper || this.sectorSwiper || this.halfSwiper) {
      console.warn('Swipers already initialized, skipping');
      return;
    }

    // Initialize based on screen size
    const isMobile = window.matchMedia('(max-width: 992px)').matches;

    if (isMobile) {
      this.initializeMobileMode();
    } else {
      this.initializeDesktopMode();
    }

      // Initialize half center swiper
    setTimeout(() => {
      this.initializeHalfCenterSwiper();
    }, 200);

    // Initialize news slider (works on both mobile and desktop)
    setTimeout(() => {
      this.initializeNewsSwiper();
    }, 100);
  }

  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1200,
        once: true,
      });

      setTimeout(() => {
        AOS.refresh();
      }, 500);
    }
  }

  initializeDesktopMode() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.error('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const sectorElement = document.querySelector('.sectorSwiper');
    if (!sectorElement) {
      console.warn('.sectorSwiper not found');
      return;
    }

    const totalSlides = document.querySelectorAll('.sectorSwiper .swiper-slide').length;

    if (totalSlides === 0) {
      console.warn('No slides found in .sectorSwiper');
      return;
    }

    // Initialize sector swiper
    this.sectorSwiper = new Swiper('.sectorSwiper', {
      modules: [Pagination],
      direction: 'vertical',
      slidesPerView: 1,
      speed: 900,
      allowTouchMove: false,
      mousewheel: false,
      pagination: {
        el: '.sector-pagination',
        clickable: true,
      },
    });

    const pinHeight = window.innerHeight * (totalSlides - 1);
    let isSyncing = false;
    let lastIndex = -1;

    // Create ScrollTrigger for desktop
    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: '.sector-wrapper',
      start: 'top top',
      end: '+=' + pinHeight,
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      pinSpacing: true,
      snap: {
        snapTo: (value: number) => {
          const step = 1 / (totalSlides - 1);
          return Math.round(value / step) * step;
        },
        duration: 0.45,
        ease: 'power2.out',
      },
      onUpdate: (self: any) => {
        if (isSyncing) return;

        const index = Math.round(self.progress * (totalSlides - 1));
        if (index === lastIndex) return;

        lastIndex = index;
        isSyncing = true;

        if (this.sectorSwiper) {
          this.sectorSwiper.slideTo(index, 700, false);
        }

        gsap.delayedCall(0.75, () => {
          isSyncing = false;
        });
      },
      onLeave: (self: any) => {
        if (
          typeof window === 'undefined' ||
          !self ||
          typeof self.end !== 'number' ||
          !isFinite(self.end)
        ) {
          return;
        }
        gsap.to(window, {
          scrollTo: {
            y: self.end,
            autoKill: true,
          },
          duration: 0.35,
          ease: 'power1.out',
          overwrite: true,
        });
      },
      onEnterBack: () => {
        lastIndex = -1;
      },
    });

  
  }
  

  initializeMobileMode() {
    const sectorElement = document.querySelector('.sectorSwiper');
    if (!sectorElement) return;

    const counter = document.createElement('div');
    counter.className = 'swiper-counter';
    sectorElement.appendChild(counter);

    // Kill any existing ScrollTriggers
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ScrollTrigger.clearScrollMemory();
    }

    // Remove pin spacer if exists
    this.removePinSpacer();

    // Reset wrapper styles
    const wrapper = document.querySelector('.sector-wrapper') as HTMLElement;
    if (wrapper) wrapper.removeAttribute('style');

    // Initialize mobile swiper
    this.mobileSwiper = new Swiper('.sectorSwiper', {
      modules: [Autoplay, Pagination],
      direction: 'horizontal',
      slidesPerView: 1,
      speed: 600,
      allowTouchMove: true,
      resistanceRatio: 0.85,
      threshold: 10,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      pagination: {
        el: '.sector-pagination',
        clickable: true,
      },
      on: {
        init: (swiper: any) => {
          const slidesPerView = swiper.slidesPerViewDynamic();
          const current = String(1).padStart(2, '0');
          const total = String(swiper.slides.length - (slidesPerView - 1)).padStart(2, '0');
          
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
        slideChange: (swiper: any) => {
          const slidesPerView = swiper.slidesPerViewDynamic();

          const current = String(swiper.realIndex + 1).padStart(2, '0');
          const total = String(swiper.slides.length - (slidesPerView - 1)).padStart(2, '0');
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
      },
    });
  }

  removePinSpacer() {
    document.querySelectorAll('.pin-spacer').forEach((spacer) => {
      const parent = spacer.parentNode;
      while (spacer.firstChild) {
        parent?.insertBefore(spacer.firstChild, spacer);
      }
      parent?.removeChild(spacer);
    });
  }

  initializeHalfCenterSwiper() {
    const halfElement = document.querySelector('.halfCenterSwiper');
    if (!halfElement) return;

    this.halfSwiper = new Swiper('.halfCenterSwiper', {
      modules: [Pagination, Navigation],
      slidesPerView: 1,
      centeredSlides: true,
      loop: true,
      spaceBetween: 0,
      speed: 600,
      autoplay: false,
      navigation: {
        nextEl: '.real-next',
        prevEl: null,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      on: {
        init: (swiper: any) => {
          this.createDynamicCounter();
          this.updateDynamicCounter(swiper);
          this.wrapCounterAndPagination();
          this.activateCursorFollowButton(swiper);
        },
        slideChange: (swiper: any) => {
          this.updateDynamicCounter(swiper);
        },
      },
    });
  }

  createDynamicCounter() {
    const old = document.querySelector('.half-counter');
    if (old) old.remove();

    const counter = document.createElement('div');
    counter.className = 'half-counter';
    counter.innerHTML = `<span class="half-current">01</span> <span class="dotts_sect"></span> <span class="half-total">01</span>`;
    document.querySelector('.halfCenterSwiper')?.appendChild(counter);
  }

  updateDynamicCounter(swiper: any) {
    const current = swiper.realIndex + 1;
    const slidesArray = Array.from(swiper.slides) as HTMLElement[];
    const total = slidesArray.filter(
      (slide) => slide.getAttribute('data-swiper-slide-index') !== null,
    ).length;

    const currentEl = document.querySelector('.half-current') as HTMLElement;
    const totalEl = document.querySelector('.half-total') as HTMLElement;

    if (currentEl) currentEl.textContent = current.toString().padStart(2, '0');
    if (totalEl) totalEl.textContent = total.toString().padStart(2, '0');
  }

  wrapCounterAndPagination() {
    const halfCounter = document.querySelector('.half-counter');
    const pagination = document.querySelector('.halfCenterSwiper .swiper-pagination');

    if (
      halfCounter &&
      pagination &&
      !halfCounter.parentElement?.classList.contains('counter-pagination-wrapper')
    ) {
      const wrapper = document.createElement('div');
      wrapper.className = 'counter-pagination-wrapper container position-relative';
      pagination.parentNode?.insertBefore(wrapper, pagination);
      wrapper.appendChild(halfCounter);
      wrapper.appendChild(pagination);
    }
  }

  activateCursorFollowButton(swiper: any) {
    const section = document.querySelector('.rapid-section') as HTMLElement;
    const storyBtn = document.querySelector('.story-next') as HTMLElement;
    const realNext = document.querySelector('.real-next') as HTMLElement;

    if (!section || !storyBtn || !realNext) return;

    const originalStyle = {
      position: storyBtn.style.position || '',
      left: storyBtn.style.left || '',
      top: storyBtn.style.top || '',
      transform: storyBtn.style.transform || '',
    };

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const speed = 0.7;

    storyBtn.style.transition = 'opacity 0.25s ease, left 0.2s ease, top 0.2s ease';

    section.addEventListener('mouseenter', () => {
      storyBtn.classList.add('cursor-follow');
      storyBtn.style.position = 'fixed';
      storyBtn.style.opacity = '1';
    });

    section.addEventListener('mouseleave', () => {
      storyBtn.classList.remove('cursor-follow');
      storyBtn.style.opacity = '0';

      setTimeout(() => {
        storyBtn.style.position = originalStyle.position;
        storyBtn.style.left = originalStyle.left;
        storyBtn.style.top = originalStyle.top;
        storyBtn.style.transform = originalStyle.transform;
        storyBtn.style.opacity = '1';
      }, 200);
    });

    // section.addEventListener('mousemove', (e: MouseEvent) => {
    //   targetX = e.clientX;
    //   targetY = e.clientY;
    // });

    // section.addEventListener('click', (e: MouseEvent) => {
    //   if (!(e.target as HTMLElement).closest('.story-next')) {
    //     swiper.slideNext();
    //   }
    // });

    // storyBtn.addEventListener('click', (e: MouseEvent) => {
    //   e.stopPropagation();
    //   realNext.click();
    // });

    const anchors = section.querySelectorAll('a');
    anchors.forEach((anchor) => {
      anchor.addEventListener('mouseenter', () => {
        storyBtn.style.opacity = '0';
      });
      anchor.addEventListener('mouseleave', () => {
        storyBtn.style.opacity = '1';
      });
    });

    const animate = () => {
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      if (storyBtn.classList.contains('cursor-follow')) {
        storyBtn.style.left = currentX + 'px';
        storyBtn.style.top = currentY + 'px';
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  initializeNewsSwiper() {
    const sliderEl = document.querySelector('.newsSlider');
    if (!sliderEl) {
      console.warn('.newsSlider not found');
      return;
    }

    const paginationEl = sliderEl.querySelector('.news-pagination');

    // Remove old counter if exists
    const oldCounter = sliderEl.querySelector('.swiper-counter');
    if (oldCounter) oldCounter.remove();

    const counter = document.createElement('div');
    counter.className = 'swiper-counter';
    sliderEl.appendChild(counter);

    let slidesPerPage = 3;

    this.newsSwiper = new Swiper('.newsSlider', {
      modules: [Pagination, Navigation],
      slidesPerView: slidesPerPage,
      spaceBetween: 30,
      loop: false,
      speed: 900,
      observer: true,
      observeParents: true,
      pagination: {
        el: paginationEl as HTMLElement,
        clickable: true,
        type: 'bullets',
      },
      navigation: {
        nextEl: '.news-next',
        prevEl: '.news-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1,spaceBetween: 10, },
        576: { slidesPerView: 1,spaceBetween: 10, },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 2 },
        1199: { slidesPerView: 3 },
      },
      on: {
        init: (swiper: any) => {
          const slidesPerView = swiper.slidesPerViewDynamic();
          const current = String(1).padStart(2, '0');
          const total = String(swiper.slides.length - (slidesPerView - 1)).padStart(2, '0');
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
        slideChange: (swiper: any) => {
          const slidesPerView = swiper.slidesPerViewDynamic();

          const current = String(swiper.realIndex + 1).padStart(2, '0');
          const total = String(swiper.slides.length - (slidesPerView - 1)).padStart(2, '0');
          counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
        },
      },
    });
  }

  onThumbSlideChange(e: any) {
    this.activeIndex = e.detail[0].activeIndex;
  }

  getPageDetails() {
    this.wpapi
      .getPageDetailsBySlug('home')
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (response) => {
          if (!response.length) return;
          this.data = response;
          this.acfFields = this.data[0]?.acf_fields;
          this.pageDataLoaded = true;
          console.log(this.acfFields)
        },
        error: (error) => {
          console.error('Error fetching page details:', error);
          this.pageDataLoaded = true; // Set to true to not block initialization
        },
      });
  }

  getFeaturedSolutions() {
    this.wpapi
      .getSolutionList()
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (response) => {
          if (!response) return;
          this.featuredSolutions = response ?? [];
          this.featuredSolutionsLoaded = true;
        },
        error: (error) => {
          console.error('Error fetching solutions:', error);
          this.featuredSolutionsLoaded = true;
        },
      });
  }

  getSectorsList() {
    this.wpapi
      .getSectorsList()
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (response) => {
          if (!response) return;
          this.sectorsList = response;
          this.sectorsLoaded = true;
        },
        error: (error) => {
          console.error('Error fetching sectors:', error);
          this.sectorsLoaded = true;
        },
      });
  }

  getCaseStudy() {
    this.wpapi
      .getStoriesList(1, 0, 'date', 'desc')
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (response) => {
          if (!response) return;
          let data: Array<any> = response?.body || [];
          this.caseStudyList = data.filter((res) => res.acf_fields.stories_featured)?.[0];
          this.caseStudyLoaded = true;
        },
        error: (error) => {
          console.error('Error fetching case study:', error);
          this.caseStudyLoaded = true;
        },
      });
  }

  getLatestNews() {
    this.wpapi
      .getLatestNewsPosts(1, 6)
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (response) => {
          this.latestNews = response?.body || [];
          this.newsLoaded = true;
        },
        error: (error) => {
          console.error('Error fetching news:', error);
          this.newsLoaded = true;
        },
      });
  }

  openPopupModal(data: any) {
    console.log(data);
    this.selectedModalData = data;
  }
}
