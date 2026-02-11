import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/home/home')
        .then(c => c.Home)
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./components/about-us/about-us')
        .then(c => c.AboutUs),
    data: { breadcrumb: 'About Us' }
  },
  {
    path: 'solutions',
    loadComponent: () =>
      import('./components/solutions/solutions')
        .then(c => c.Solutions),
    data: { breadcrumb: 'Solutions' }
  },
  {
    path: 'sectors',
    loadComponent: () =>
      import('./components/sectors/sectors')
        .then(c => c.Sectors),
    data: { breadcrumb: 'Sectors' }
  },
  {
    path: 'how-we-work',
    loadComponent: () =>
      import('./components/how-we-work/how-we-work')
        .then(c => c.HowWeWork),
    data: { breadcrumb: 'How We Work' }
  },
  {
    path: 'impact-stories',
    loadComponent: () =>
      import('./components/impact-stories/impact-stories')
        .then(c => c.ImpactStories),
    data: { breadcrumb: 'Impact Stories' }
  },

   {
    path: 'impact-stories/:slug',
    loadComponent: () =>
      import('./components/impact-stories/stories-details/stories-details')
        .then(c => c.StoriesDetails),
    data: { breadcrumb: 'Impact Stories' }
  },

  /* NEWS */
  {
    path: 'news',
    loadComponent: () =>
      import('./components/news-listing/news-listing')
        .then(c => c.NewsListing),
    data: { breadcrumb: 'Media Center' }
  },
  {
    path: 'news/:slug',
    loadComponent: () =>
      import('./components/news-details/news-details')
        .then(c => c.NewsDetails),
    data: { breadcrumb: 'Media Center' }
  },

  {
    path: 'contact-us',
    loadComponent: () =>
      import('./components/contact-us/contact-us')
        .then(c => c.ContactUs),
    data: { breadcrumb: 'Contact' }
  },

  /* 404 */
  {
    path: '**',
    loadComponent: () =>
      import('./comman/not-found/not-found')
        .then(c => c.NotFound)
  }
];
