import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Wpapi } from '../../Services/Services/wpapi';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { DomSanitizer } from '@angular/platform-browser';

declare const AOS: any;

@Component({
  selector: 'app-solutions',
  imports: [CommonModule, Breadcrumb],
  templateUrl: './solutions.html',
  styleUrl: './solutions.css',
   host: {
    ngSkipHydration: ''
  }
})
export class Solutions implements OnInit, AfterViewInit {
  constructor(
    private wpapi: Wpapi,
    private sanitizer: DomSanitizer,
  ) {}

  Destroy$ = new Subject<void>();
  solutionData: any = {};
  solutionList: Array<any> = [];
  selectedData: any = {};
 
  ngOnInit(): void {
    this.getSolutionPage();
    this.getAllSolutions();
  }

  getSolutionPage(): void {
    this.wpapi
      .getPageDetailsBySlug('solutions')
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (data) => {
          if (data.length) {
            this.solutionData = data[0]?.acf_fields;
          }
        },
      });
  }

  getAllSolutions(): void {
    this.wpapi
      .getSolutionList()
      .pipe(takeUntil(this.Destroy$))
      .subscribe({
        next: (data) => {
          if (data.length) {
            this.solutionList = data;

            // this.acffieldsData.forEach((acf: any) => {
            //   let pointers = acf?.acf_fields?.solutions_details_pointers;

            //   // Make sure it is always an array
            //   if (!Array.isArray(pointers)) {
            //     pointers = [];
            //   }

            //   pointers.forEach((item: any) => {
            //     const icon = item?.solutions_pointers_icon || '';

            //     if (icon.trim().startsWith('<svg')) {
            //       item.isSvg = true;
            //       item.safeSvg = this.sanitizer.bypassSecurityTrustHtml(icon);
            //     } else {
            //       item.isSvg = false;
            //     }
            //   });

            //   // Assign cleaned data back
            //   acf.acf_fields.solutions_details_pointers = pointers;
            // });

          }
        },
        error: (err) => {
          console.error('Error fetching solutions data:', err);
        },
      });
  }

  openModal(data: any): void {
    console.log(data)
    this.selectedData = data
  }

  ngAfterViewInit(): void {
    this.aosview();
  }

  aosview() {
    AOS.init({ duration: 1200, once: true });
    setTimeout(() => AOS.refresh(), 400);
  }
}
