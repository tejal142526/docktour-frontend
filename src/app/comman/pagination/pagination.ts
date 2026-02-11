import { AfterContentChecked, AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination implements OnInit, OnChanges {
  @Input() TotalPages: number = 10;
  @Input() currentPage!: number;
  @Output() pageChanged = new EventEmitter<any>();
  
  visiblePages: Array<any> = [];

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.updateVisiblePages();
  }


  gotopage(page: number) {
    // if(this.currentPage == page) return;
    this.currentPage = page;

    this.pageChanged.emit(page);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const pages: (number | string)[] = [];

    if (this.TotalPages <= 5) {
      for (let i = 1; i <= this.TotalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (this.currentPage > 3) pages.push('...');

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.TotalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (this.currentPage < this.TotalPages - 2) pages.push('...');

      pages.push(this.TotalPages);
    }

    this.visiblePages = pages;
  }
}
