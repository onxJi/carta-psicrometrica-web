import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {
    class: "bg-white border-gray-200 dark:bg-gray-900"
  }
})
export class NavbarComponent {

  public contentValue = viewChild<ElementRef<HTMLDivElement>>('navbarCta');

  abrirMenu() {
    this.contentValue()?.nativeElement
  }
}
