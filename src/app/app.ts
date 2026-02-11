import { Component, HostListener, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Header } from './comman/header/header';
import { Footer } from './comman/footer/footer';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { platformBrowser } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isMobile: boolean = false;

  @HostListener('window:resize')
  checkScreenWidth(): void {
    this.isMobile = window.innerWidth < 768;

    // optional body class
    document.body.classList.toggle('mobile', this.isMobile);
    document.body.classList.toggle('desktop', !this.isMobile);
  }   

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        const page = this.router.url.split('/') || '';
        let pageName = this.router.url.split('/').pop() || '';
        if (page?.[1] == 'news') {
          pageName = 'news';
        }
       else if (page?.[1] == 'impact-stories' && page.length>2) {
          // pageName = 'impact-stories-detail';
          pageName = 'news';
        }
        document.body.className = '';
        document.body.classList.add(pageName);
      });
    }
  }
  protected readonly title = signal('docktour-frontend');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenWidth();
    }
  }
}
