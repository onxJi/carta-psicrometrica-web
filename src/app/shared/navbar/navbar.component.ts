import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {
    class: "border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
  }
})
export class NavbarComponent {

  public contentValue = viewChild<ElementRef<HTMLDivElement>>('navbarCta');

  abrirMenu() {
    this.contentValue()?.nativeElement.classList.toggle('hidden');
  }
}
