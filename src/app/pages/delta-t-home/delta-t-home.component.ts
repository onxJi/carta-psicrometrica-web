import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DeltaTParametrosComponent } from '../../components/delta-t-parametros/delta-t-parametros.component';
import { GraficaDeltaTComponent } from '../../components/grafica-delta-t/grafica-delta-t.component';

@Component({
  selector: 'app-delta-t-home',
  standalone: true,
  imports: [DeltaTParametrosComponent, GraficaDeltaTComponent],
  templateUrl: './delta-t-home.component.html',
  styleUrl: './delta-t-home.component.css',
  host: {
    style: "width: 100%;"
  }
})
export default class DeltaTHomeComponent implements OnInit {

  public title = inject(Title);
  public meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Delta T indicador');
    this.meta.updateTag({
      name: 'description',
      content: 'Pagina web para construir tu grafica de DeltaT indicador'
    });
    this.meta.updateTag({
      name: 'og:title',
      content: 'Carta Psicrometrica'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'Carta Psicrómetrica, Psychrometric Chart, Entalpia, Temperatura Bulbo humedo, Delta T indicador'
    })
  }

}
