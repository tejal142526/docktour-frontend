import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';

interface Breadcrumbs {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb implements OnInit, OnChanges {
  breadcrumbs: Breadcrumbs[] = [];
  @Input() pageTitle: string = ''; // Now accepts Input from parent component
  
  constructor(
    private route: Router, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateBreadcrumbs();
    
    // Update breadcrumbs on route changes
    this.route.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.pageTitle)
  }

  updateBreadcrumbs(): void {
    this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root);
  }

  buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumbs[] = []): Breadcrumbs[] {
    const children: ActivatedRoute[] = route.children;
    
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      
      if (label) {
        // Check if this route has params (like :slug)
        const hasParams = Object.keys(child.snapshot.params).length > 0;
        
        if (hasParams) {
          // For detail pages with params, use the parent URL only
          const parentUrl = url.substring(0, url.lastIndexOf('/'));
          breadcrumbs.push({ label, url: parentUrl || url });
        } else {
          // For regular pages, use the full URL
          breadcrumbs.push({ label, url });
        }
      }

      // Continue recursion
      breadcrumbs = this.buildBreadcrumb(child, url, breadcrumbs);
    }
    
    return breadcrumbs;
  }
}
