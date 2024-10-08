import { Component, OnInit, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-helps-page',
  standalone: true,
  imports: [],
  templateUrl: './helps-page.component.html',
  styleUrl: './helps-page.component.css'
})
export default class HelpsPageComponent implements OnInit {

  public title = inject(Title);
  public meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Carta Psicrometrica - Help');
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