import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Wpapi } from '../../Services/Services/wpapi';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';

declare const gsap: any;
declare const ScrollTrigger: any;
declare const AOS: any;
import { Subject, takeUntil } from 'rxjs';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.html',
  imports: [CommonModule, Breadcrumb],
  styleUrl: './about-us.css',
  host: {
    ngSkipHydration: ''
  }
})
export class AboutUs implements OnInit, AfterViewInit, OnDestroy {
  data: any = {};
  acfFields: any = {};
  sliderInitialized = false;

  leaderList: Array<any> = [];
  slides: any[] = []; // HERO SLIDER data array
  Destroy$ = new Subject<void>();

  @ViewChild('leaderSlider', { static: false }) leaderSlider!: ElementRef

  constructor(private wpapi: Wpapi) { }

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();
  }

  ngOnInit(): void {
    this.getPageData();
    this.getLeadersList();
  }

  getLeadersList() {
    this.wpapi
      .getLeadersList()
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (data) => {
          this.leaderList = data || [];
        },
        error: (err) => console.error('Error fetching leaders data:', err),
      });
  }

  ngAfterViewInit(): void { }

  getPageData() {
    this.wpapi.getPageDetailsBySlug('about-us').subscribe({
      next: (value) => {
        if (value.length) {
          this.data = value[0];
          this.acfFields = this.data?.acf_fields;

          // Assume slides data comes from ACF fields
          this.slides = this.acfFields?.repeater_cards_2 || [];

          setTimeout(() => {
            this.initSlider();
            this.initHeroSlider();
          }, 300);
        }
      },
      error: (err) => console.error(err),
    });
  }

  /* -----------------------------
     HERO SLIDER FUNCTION
  ----------------------------- */
  initHeroSlider() {
    const interleaveOffset = 0.5;

    let heroSwiper: Swiper | null = null;

    function initHeroSwiper() {
      if (window.innerWidth > 767 && !heroSwiper) {
        heroSwiper = new Swiper('#heroSwiper', {
          loop: true,
          speed: 1000,
          parallax: true,
          autoplay: {
            delay: 6500,
            disableOnInteraction: false,
          },
          watchSlidesProgress: true,

          pagination: {
            el: '.hero-pagination',
            clickable: true,
          },

          navigation: {
            nextEl: '#heroSwiper .swiper-button-next',
            prevEl: '#heroSwiper .swiper-button-prev',
          },

          on: {
            progress(swiper) {
              swiper.slides.forEach((slide) => {
                const slideProgress = (slide as any).progress;
                const innerOffset = swiper.width * 0.5;
                const innerTranslate = slideProgress * innerOffset;

                const inner = slide.querySelector('.slide-inner') as HTMLElement;
                if (inner) inner.style.transform = `translate3d(${innerTranslate}px,0,0)`;
              });
            },
            touchStart(swiper) {
              swiper.slides.forEach((slide) => {
                (slide as HTMLElement).style.transition = '';
              });
            },
            setTransition(swiper, speed) {
              swiper.slides.forEach((slide) => {
                (slide as HTMLElement).style.transition = `${speed}ms`;
                const inner = slide.querySelector('.slide-inner') as HTMLElement;
                if (inner) inner.style.transition = `${speed}ms`;
              });
            },
          },
        });
      }

      // 👇 Mobile → destroy swiper
      if (window.innerWidth <= 767 && heroSwiper) {
        heroSwiper.destroy(true, true);
        heroSwiper = null;
      }
    }

    initHeroSwiper();
    window.addEventListener('resize', initHeroSwiper);


    // Set background images
    const bgSlides = document.querySelectorAll('.slide-bg-image');
    bgSlides.forEach((el: any) => {
      const bg = el.getAttribute('data-background');
      if (bg) el.style.backgroundImage = `url(${bg})`;
    });
  }

  /* -----------------------------
     OTHER SLIDERS + GSAP + AOS
  ----------------------------- */
  initSlider() {
    if (this.sliderInitialized) return;
    this.sliderInitialized = true;

    setTimeout(() => {

      /* -----------------------------
         GSAP SECTOR SLIDER
      ------------------------------ */
      gsap.registerPlugin(ScrollTrigger);

      // const totalSlides = document.querySelectorAll('.sectorSwiper .swiper-slide').length;
      const sectorSwiper = new Swiper('.sectorSwiper', {
        modules: [Pagination],
        direction: 'vertical',
        slidesPerView: 1,
        speed: 800,
        allowTouchMove: false,
        mousewheel: false,
      });

      // const pinHeight = window.innerHeight * (totalSlides - 1);
      // let lastIndex = -1;
      // let lastScroll = 0;
      // let isAnimating = false;
      // let currentIndex = 0;


      // ScrollTrigger.create({
      //   trigger: '.sector-wrapper',
      //   start: 'top top',
      //   end: '+=' + (pinHeight - window.innerHeight),
      //   pin: true,
      //   pinSpacing: true,
      //   scrub: 1.5,
      //   snap: 1 / (totalSlides - 1),
      //   fastScrollEnd: true,
      //   anticipatePin: 1,  


      //   onUpdate: (self: any) => {
      //     const totalSlides = sectorSwiper.slides.length;
      //     const index = Math.round(self.progress * (totalSlides - 1));

      //     if (index !== lastIndex) {
      //       lastIndex = index;
      //       sectorSwiper.slideTo(index);
      //       lastScroll = self.progress;
      //     }
      //   },
      // });

      gsap.registerPlugin(ScrollTrigger);

// -------------------------------
// INIT
// -------------------------------
const totalSlides = sectorSwiper.slides.length;
const scrollLength = window.innerHeight * (totalSlides - 1);

let isFromScroll = false;
let isFromSwiper = false;
let lastIndex = 0;

// -------------------------------
// SCROLLTRIGGER → SWIPER
// -------------------------------
const st = ScrollTrigger.create({
  trigger: '.sector-wrapper',
  start: 'top top',
  end: `+=${scrollLength}`,
  pin: true,
  scrub: 1.3,
  anticipatePin: 1,

  snap: {
    snapTo: 1 / (totalSlides - 1),
    duration: 0.35,
    ease: 'power1.inOut',
  },

  onUpdate(self: { progress: number; }) {
    if (isFromSwiper) return;

    const index = Math.round(self.progress * (totalSlides - 1));

    if (index !== lastIndex) {
      isFromScroll = true;
      lastIndex = index;

      sectorSwiper.slideTo(index, 600, false);

      setTimeout(() => {
        isFromScroll = false;
      }, 650);
    }
  },
});

// -------------------------------
// SWIPER → SCROLLTRIGGER (REVERSE)
// -------------------------------
sectorSwiper.on('slideChange', () => {
  if (isFromScroll) return;

  isFromSwiper = true;

  const progress = sectorSwiper.activeIndex / (totalSlides - 1);
  const scrollPos = st.start + progress * (st.end - st.start);

  window.scrollTo({
    top: scrollPos,
    behavior: 'smooth',
  });

  lastIndex = sectorSwiper.activeIndex;

  setTimeout(() => {
    isFromSwiper = false;
  }, 600);
});

// -------------------------------
// OPTIONAL: KILL ON MOBILE
// -------------------------------
if (window.innerWidth < 768) {
  st.kill();
  sectorSwiper.allowTouchMove = true;
}


//         gsap.registerPlugin(ScrollTrigger);

// const totalSlides = document.querySelectorAll('.sectorSwiper .swiper-slide').length;

// const sectorSwiper = new Swiper('.sectorSwiper', {
//   modules: [Pagination, Autoplay],
//   direction: 'vertical',
//   slidesPerView: 1,
//   speed: 800,
//   allowTouchMove: false,
//   autoplay: {
//     delay: 2500,
//     disableOnInteraction: false,
//   },
// });

// let lastIndex = -1;

// ScrollTrigger.matchMedia({

//   // 🖥 DESKTOP (992+)
//   "(min-width: 992px)": () => {

//     sectorSwiper.changeDirection('vertical');
//     sectorSwiper.allowTouchMove = false;
//     sectorSwiper.autoplay.stop();

//     const pinHeight = window.innerHeight * (totalSlides - 1);

//     ScrollTrigger.create({
//       trigger: '.sector-wrapper',
//       start: 'top top',
//       end: () => '+=' + (pinHeight - window.innerHeight),
//       pin: true,
//       scrub: 1.5,
//       snap: 1 / (totalSlides - 1),

//       onUpdate: (self: { progress: number; }) => {
//         const index = Math.round(self.progress * (totalSlides - 1));
//         if (index !== lastIndex) {
//           lastIndex = index;
//           sectorSwiper.slideTo(index);
//         }
//       },
//     });
//   },

//   // 📱 MOBILE + TABLET (0–991)
//   "(max-width: 991px)": () => {

//     ScrollTrigger.getAll().forEach((st: { kill: () => any; }) => st.kill());

//     sectorSwiper.changeDirection('horizontal');
//     sectorSwiper.allowTouchMove = true;
//     sectorSwiper.update();          // 👈 must
//     sectorSwiper.autoplay.start();  // 👈 must
//   },

// });

      AOS.init({ duration: 1200, once: true });
      setTimeout(() => AOS.refresh(), 400);

      /* -----------------------------
         PILLARS SLIDER
      ------------------------------ */
      const sliderEl: HTMLElement | null = document.querySelector('.newsSlider');
      if (sliderEl) {
        const paginationEl = sliderEl.querySelector('.news-pagination') as HTMLElement;
        const counter = document.createElement('div');
        counter.className = 'swiper-counter';
        sliderEl.appendChild(counter);

        let sliderPerPage = 2.5

        new Swiper(sliderEl, {
          modules: [Pagination, Navigation],
          slidesPerView: sliderPerPage,
          spaceBetween: 20,
          speed: 900,
          watchSlidesProgress: true,
          slidesOffsetAfter: 20,
          centerInsufficientSlides: true,
          pagination: { el: paginationEl, clickable: true, type: 'bullets' },
          navigation: { nextEl: '.news-next', prevEl: '.news-prev' },
          breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 1 },
            768: { slidesPerView: 1.5 },
            992: { slidesPerView: 1.5 },
            1024: { slidesPerView: 2.5 },
          },
          on: {
            init(swiper) {
              setTimeout(() => swiper.update(), 50);
              const total = String(swiper.slides.length - Math.floor(sliderPerPage - 1)).padStart(2, '0');
              counter.innerHTML = `<span class="current-slide">01</span><span class="dot"></span><span class="total-slides">${total}</span>`;
            },
            slideChange(swiper) {
              const current = String(swiper.realIndex + 1).padStart(2, '0');
              const total = String(swiper.slides.length - Math.floor(sliderPerPage - 1)).padStart(2, '0');
              counter.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
            },
            resize(swiper) {
              setTimeout(() => swiper.update(), 50);
            },
          },
        });
      }

      /* -----------------------------
         DIRECTORS SLIDER
      ------------------------------ */
      const sliderEl1: HTMLElement | null = document.querySelector('.newsSlider1');
      let slidePerPageDoctor = 4.5;
      if (sliderEl1) {
        const paginationEl1 = sliderEl1.querySelector('.news-pagination') as HTMLElement;
        const counter1 = document.createElement('div');
        counter1.className = 'swiper-counter';
        sliderEl1.appendChild(counter1);

        new Swiper(sliderEl1, {
          modules: [Pagination, Navigation],
          slidesPerView: slidePerPageDoctor,
          spaceBetween: 16,
          freeMode: true,
          speed: 900,
          watchSlidesProgress: true,
          slidesOffsetAfter: 20,
          centerInsufficientSlides: true,
          pagination: { el: paginationEl1, clickable: true, type: 'bullets' },
          navigation: { nextEl: '.news-next', prevEl: '.news-prev' },
          breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 1 },
            768: { slidesPerView: 1.5 },
            992: { slidesPerView: 1.5 },
            1024: { slidesPerView: 4.5 },
          },
          on: {
            init(swiper) {
              const total = String(swiper.slides.length - Math.floor(slidePerPageDoctor - 1)).padStart(
                2,
                '0',
              );
              counter1.innerHTML = `<span class="current-slide">01</span><span class="dot"></span><span class="total-slides">${total}</span>`;
            },
            slideChange(swiper) {
              const current = String(swiper.realIndex + 1).padStart(2, '0');
              const total = String(swiper.slides.length - Math.floor(slidePerPageDoctor - 1)).padStart(
                2,
                '0',
              );
              counter1.innerHTML = `<span class="current-slide">${current}</span><span class="dot"></span><span class="total-slides">${total}</span>`;
            },
          },
        });

        new Swiper(sliderEl1, {
          modules: [Pagination, Navigation],
          enabled: window.innerWidth > 768, // 👈 mobile pe false
          slidesPerView: slidePerPageDoctor,
          spaceBetween: 16,
          speed: 900,

          breakpoints: {
            0: {
              enabled: false, // 👈 mobile
            },
            767: {
              enabled: true,
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 2.5,
            },
            1024: {
              slidesPerView: 4.5,
            },
          },
        });
      }
    }, 100);
  }


  // leader on hover 
  onMouseMove(event: MouseEvent) {
    const rect = this.leaderSlider.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;

    this.leaderSlider.nativeElement.classList.remove('left-hover', 'right-hover');

    if (x < rect.width / 2) {
      this.leaderSlider.nativeElement.classList.add('left-hover');
    } else {
      this.leaderSlider.nativeElement.classList.add('right-hover');
    }
  }

  onMouseLeave() {
    this.leaderSlider.nativeElement.classList.remove('left-hover', 'right-hover');
  }
}
