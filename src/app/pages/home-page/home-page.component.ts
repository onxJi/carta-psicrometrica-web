import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AltitudComponentComponent } from '../../components/altitud-component/altitud-component.component';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AltitudComponentComponent, PrimeNgExportModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export default class HomePageComponent implements OnInit {

  public title = inject(Title);
  public meta = inject(Meta);

  data: any;

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




    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const dataw = [{ x: 'Jan', net: 100, cogs: 50, gm: 50 }, { x: 'Feb', net: 120, cogs: 55, gm: 75 }];
    this.data = {
      labels: [-10,0,10,20,30,40,50,60],
      datasets: [
        {
          label: 'First Dataset',
          data: dataw, // Line 2
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

}
