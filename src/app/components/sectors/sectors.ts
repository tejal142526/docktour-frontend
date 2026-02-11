import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Wpapi } from '../../Services/Services/wpapi';
import { Subject, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { CommonModule } from '@angular/common';

declare const AOS: any;
@Component({
  selector: 'app-sectors',
  imports: [Breadcrumb, CommonModule],
  templateUrl: './sectors.html',
  styleUrl: './sectors.css',
    host: {
    ngSkipHydration: ''
  }
})
export class Sectors implements OnInit, AfterViewInit, OnInit, OnDestroy {
  constructor(private wpapi: Wpapi) {}

  Destroy$ = new Subject<void>();
  sectorsDetails: any = {};
  sectorsList: Array<any> = [];
  showPopup = false;


  ngOnInit(): void {
    this.getSectorDetails();
    this.getSectorsList();
  }

  ngOnDestroy(): void {
    this.Destroy$.next();
    this.Destroy$.complete();
  }

  getSectorDetails(): void {
    this.wpapi
      .getPageDetailsBySlug('sectors')
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (data) => {
          if (data.length) {
            this.sectorsDetails = data[0]?.acf_fields;
          }
        },
        error: (error) => {
          console.error('Error fetching sector details:', error);
        },
      });
  }

  getSectorsList(): void {
    this.wpapi
      .getSectorsList()
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (data) => {
          if (data.length) {
            this.sectorsList = data;
          }
        },
      });
  }

  ngAfterViewInit(): void {
    this.aosview();
  }

  aosview() {
    AOS.init({ duration: 1200, once: true });
    setTimeout(() => AOS.refresh(), 400);
  }
}
