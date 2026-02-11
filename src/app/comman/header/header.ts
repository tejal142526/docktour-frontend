import { Component, Inject, PLATFORM_ID, } from '@angular/core';
import { RouterLink } from "@angular/router";
import {
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements AfterViewInit {
  constructor( @Inject(PLATFORM_ID) private platformId: Object,) {

  }

  @ViewChild('hdr') header!: ElementRef<HTMLElement>;
  @ViewChild('spacer') spacer!: ElementRef<HTMLElement>;

  lastScroll = 0;
  threshold = 80;

  isMenuOpen = false;

  // isHidden = false;
  // isFlow = false;
 isHidden = false;   // 👈 header hide/show
  isFlow = false;     // 👈 top flow state
  isScrolled = false; // 👈 class add ke liye


  

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
    // Existing logic
    this.setSpacer(true);

    // ✅ Mobile menu JS (Option 1)
    const toggleBtn = document.querySelector('.navbar-toggler-mobile') as HTMLElement;
    const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement;
    const closeBtn = document.querySelector('.close-menu') as HTMLElement;

    if (!toggleBtn || !mobileMenu || !closeBtn) {
      console.warn('Mobile menu elements not found');
      return;
    }

    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }
  }

  setSpacer(active: boolean) {
    this.spacer.nativeElement.style.height = active
      ? `${this.header.nativeElement.offsetHeight}px`
      : '0px';
  }

  // @HostListener('window:scroll')
 @HostListener('window:scroll', [])
  onScroll() {
    const y = window.scrollY;
    const d = y - this.lastScroll;

    this.isFlow = false;
    this.isScrolled = y > 10; // 👈 scroll par class

    if (y === 0) {
      this.isHidden = false;
    }
    else if (y < this.threshold) {
      this.isFlow = true;
      this.isHidden = false;
    }
    else {
      if (d > 5) this.isHidden = true;   // scroll down → hide
      if (d < -5) this.isHidden = false; // scroll up → show
    }

    this.lastScroll = y;
  }
}
