import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AltitudComponentComponent } from '../../components/altitud-component/altitud-component.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AltitudComponentComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export default class HomePageComponent implements OnInit {

  public title = inject(Title);
  public meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Carta Psicrometrica');
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
