import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AltitudComponentComponent } from '../../components/altitud-component/altitud-component.component';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { style } from '@angular/animations';
import { GraficaComponent } from '../../components/grafica/grafica.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AltitudComponentComponent, PrimeNgExportModule, GraficaComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  host: {
    style: "width: 100%"
  }
})
export default class HomePageComponent implements OnInit {

  public title = inject(Title);
  public meta = inject(Meta);

  data: any;

  cartas = [
    {
      label: 'Cartas Psicrométricas',
      url: "/cartas-psicrometricas",
      icon: "assets/icon.svg",
      description: "Construye cartas psicrométricas a diferentes altitudes y temperaturas, con la posibilidad de exportarlas a PDF o PNG"
    },
    {
      label: 'Grafica Delta T (∆T)',
      url: "/deltaT-indicador",
      icon: "assets/icon.svg",
      description: "Construye la grafica de Delta T (∆T) como indicador del ambiente meteorológico para pulverizaciones."
    }
  ]

  options: any;

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
