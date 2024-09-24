import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export default class AboutPageComponent implements OnInit {

  public title = inject(Title);
  public meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Carta Psicrometrica - About');
    this.meta.updateTag({
      name: 'description',
      content: 'Pagina web para construir tu carta psicrometrica a diferentes altitudes'
    });
    this.meta.updateTag({
      name: 'og:title',
      content: 'Carta Psicrometrica'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'Carta Psicrómetrica, Psychrometric Chart, Entalpia, Temperatura Bulbo humedo'
    })
  }

}
