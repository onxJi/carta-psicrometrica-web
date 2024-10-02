import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { PrimeNgExportModule } from '../primengExportModule/PrimeNgExportModule.module';
import { CommonModule } from '@angular/common';
import { style } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, PrimeNgExportModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {
    style: 'width: 100%;'
  }
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] | undefined;
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: 'home'
      },
      {
        label: 'About',
        icon: 'pi pi-star',
        routerLink: 'about'
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: 'contact'
      }
    ]
  }



}
