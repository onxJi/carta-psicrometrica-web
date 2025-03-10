import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component')
    },
    {
        path: 'cartas-psicrometricas',
        loadComponent: () => import('./pages/carta-psicrometrica-home/carta-psicrometrica-home.component')
    },
    {
        path: 'deltaT-indicador',
        loadComponent: () => import('./pages/delta-t-home/delta-t-home.component')
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about-page/about-page.component'),
    },
    {
        path: 'help',
        loadComponent: () => import('./pages/helps-page/helps-page.component')
    },
    {
        path: 'contact',
        loadComponent: () => import('./pages/contact-page/contact-page.component')
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
