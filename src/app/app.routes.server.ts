import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },

  { path: 'about-us', renderMode: RenderMode.Server },
  { path: 'solutions', renderMode: RenderMode.Server },
  { path: 'sectors', renderMode: RenderMode.Server },
  { path: 'how-we-work', renderMode: RenderMode.Server },
  { path: 'impact-stories', renderMode: RenderMode.Server },
  { path: 'impact-stories/:slug', renderMode: RenderMode.Server },

  { path: 'news', renderMode: RenderMode.Server },
  { path: 'news/:slug', renderMode: RenderMode.Server },

  { path: 'contact-us', renderMode: RenderMode.Server },

  { path: '**', renderMode: RenderMode.Server },
];


 