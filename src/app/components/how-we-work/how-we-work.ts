import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { CommonModule } from '@angular/common';
import { Wpapi } from '../../Services/Services/wpapi';
import { Subject, takeUntil } from 'rxjs';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

declare const AOS: any;
declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-how-we-work',
  imports: [Breadcrumb, CommonModule],
  templateUrl: './how-we-work.html',
  styleUrl: './how-we-work.css',
  host: {
    ngSkipHydration: '',
  },
})
export class HowWeWork implements OnInit, AfterViewInit, OnDestroy {
  newsSwiper: any;
  sectorSwiper: any;
  halfSwiper: any;

  pageData: any = {};
  dataLoaded = false;

  Destroy$ = new Subject<void>();

  constructor(private wpapi: Wpapi) {}

  activeIndex = 0;

  accordions = [
    {
      title: 'QMS',
      content:
        'We adhere to ISO standards through rigorous document control, a structured audit cadence, continuous CAPA processes, and proactive risk management, ensuring consistent quality and operational excellence.',
    },
    {
      title: 'Accreditation Readiness',
      content:
        'We prepare teams for JCI and CAP accreditation pathways, conduct detailed mock tracers, maintain comprehensive policy libraries, and ensure staff competency through continuous training and assessment.',
    },
    {
      title: 'IPC',
      content:
        'We conduct thorough hand hygiene audits, monitor environmental safety, validate sterilization processes, and implement robust antimicrobial stewardship programs to uphold the highest standards of clinical quality and patient safety.',
    },
    {
      title: 'Incident Management',
      content:
        'We perform root-cause analysis, apply FMEA, report near-misses, and embed lessons-learned loops to drive continuous improvement and strengthen operational resilience.',
    },
  ];

  ngOnInit(): void {
    this.getPageDetails();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.aosview();

    // Wait for data to load before initializing sliders
    if (this.dataLoaded) {
      this.initializeSliders();
    }
  }

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();

    // Destroy all Swiper instances
    if (this.newsSwiper) this.newsSwiper.destroy(true, true);
    if (this.sectorSwiper) this.sectorSwiper.destroy(true, true);
    if (this.halfSwiper) this.halfSwiper.destroy(true, true);
  }

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }

  aosview() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 1200, once: true });
      setTimeout(() => AOS.refresh(), 400);
    }
  }

  getPageDetails() {
    this.wpapi
      .getPageDetailsBySlug('how-we-work')
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (!res.length) return;
          this.pageData = res[0];
          this.dataLoaded = true;

          // Initialize sliders after data is loaded and DOM is ready
          setTimeout(() => {
            this.initializeSliders();
          }, 100);
        },
        error: (err) => console.log(err),
      });
  }

  initializeSliders() {
    if (typeof window === 'undefined') return;

    // Check if already initialized to prevent double initialization
    if (this.newsSwiper || this.sectorSwiper || this.halfSwiper) {
      return;
    }

    setTimeout(() => {
      this.initializeSectorSwiper();
      this.initializeHalfCenterSwiper();
      this.initializeNewsSwiper();

      // Refresh AOS after all sliders are initialized
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 300);
  }

  initializeSectorSwiper() {
    const sectorElement = document.querySelector('.sectorSwiper');
    if (!sectorElement) return;

    const totalSlides = document.querySelectorAll('.sectorSwiper .swiper-slide').length;

    if (totalSlides === 0) {
      console.warn('No slides found in .sectorSwiper');
      return;
    }
    const counter = document.createElement('div');
    counter.className = 'sector-counter';
    sectorElement.appendChild(counter);

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
      breakpoints: {
        0: {
          direction: 'horizontal',
          allowTouchMove: true,
          mousewheel: false,
        },
        1024: {
          direction: 'vertical',
          allowTouchMove: false,
          mousewheel: false,
        },
      },
       on: {
      init: (swiper: any) => this.updateSectorCounter(swiper),
      slideChange: (swiper: any) => this.updateSectorCounter(swiper),
      resize: (swiper: any) => this.updateSectorCounter(swiper),
    }
  
    });

    // Initialize GSAP ScrollTrigger only on desktop
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const pinHeight = window.innerHeight * (totalSlides - 1);
        let isSyncing = false;
        let lastIndex = -1;

        ScrollTrigger.create({
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
          onEnterBack: () => {
            lastIndex = -1;
          },
        });
      });
    }
  }
updateSectorCounter(swiper: any) {
  const sliderEl = swiper.el as HTMLElement;

  // show counter ONLY in horizontal mode
  const isHorizontal = swiper.params.direction === 'horizontal';

  let counter = sliderEl.querySelector('.swiper-counter') as HTMLElement;

  if (!isHorizontal) {
    if (counter) counter.remove();
    return;
  }

  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'swiper-counter';
    sliderEl.appendChild(counter);
  }

  const slidesPerView = swiper.slidesPerViewDynamic();
  const totalPages = Math.ceil(swiper.slides.length / slidesPerView);
  const currentPage = Math.floor(swiper.realIndex / slidesPerView) + 1;

  counter.innerHTML = `
    <span class="current">${String(currentPage).padStart(2, '0')}</span>
    <span class="dot"></span>
    <span class="total">${String(totalPages).padStart(2, '0')}</span>
  `;
}
  initializeHalfCenterSwiper() {
    const halfElement = document.querySelector('.halfCenterSwiper');
    if (!halfElement) return;

    this.halfSwiper = new Swiper('.halfCenterSwiper', {
      modules: [Pagination, Navigation],
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      spaceBetween: 20,
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

  initializeNewsSwiper() {
    const sliderEl = document.querySelector('.newsSlider');
    if (!sliderEl) return;

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
        0: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
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

    section.addEventListener('mousemove', (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    section.addEventListener('click', (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.story-next')) {
        swiper.slideNext();
      }
    });

    storyBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      realNext.click();
    });

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
}
