import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Breadcrumb } from '../../../comman/breadcrumb/breadcrumb';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Wpapi } from '../../../Services/Services/wpapi';

@Component({
  selector: 'app-stories-details',
  imports: [Breadcrumb, CommonModule],
  templateUrl: './stories-details.html',
  styleUrl: './stories-details.css',
})
export class StoriesDetails {
  data: any = {};
  title: string = '';

  Destroy$ = new Subject<void>();
  newsSwiper: any;

  fbShareLink = '';
  linkedInShareLink = '';
  shareURL: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private wpapi: Wpapi,
    private activatedRoute: ActivatedRoute,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.shareURL = encodeURIComponent(window.location.href);
    }

    this.activatedRoute.paramMap.subscribe((res) => {
      let slug = res.get('slug') || '';
      this.getStoryDetails(slug);
    });
  }

  ngOnInit() {
    this.fbShareLink = `https://www.facebook.com/sharer/sharer.php?u=${this.shareURL}`;
    this.linkedInShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${this.shareURL}`;
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();
  }

  getStoryDetails(slug: string) {
    this.wpapi
      .getStoriesDetailsBySlug(slug)
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (res) => {
          if (!res.length) {
            return;
          }
          let data = res?.[0];
          this.data = data;
          this.title = data?.title?.rendered;

          console.log('📄 News Details:', this.data);
        },
        error: (err) => {
          console.error('❌ Error fetching news details:', err);
        },
      });
  }
}
