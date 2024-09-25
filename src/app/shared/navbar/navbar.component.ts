import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {

  }
})
export class NavbarComponent {

  public contentValue = viewChild<ElementRef<HTMLDivElement>>('navbarCta');

  abrirMenu() {
    this.contentValue()?.nativeElement.classList.toggle('hidden');
  }
}
