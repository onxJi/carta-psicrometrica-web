import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component')
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about-page/about-page.component'),
    },
    {
        path: 'help',
        loadComponent: ()=> import('./pages/helps-page/helps-page.component')
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
