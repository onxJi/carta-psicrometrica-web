import { Component, OnInit } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { style } from '@angular/animations';

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [PrimeNgExportModule],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css',
  host: {
    style: 'width: 100%'
  }
})
export class GraficaComponent implements OnInit {


  data: any;

  options: any;
  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    //const dataw = [{ x: 'Jan', net: 100, cogs: 50, gm: 50 }, { x: 'Feb', net: 120, cogs: 55, gm: 75 }];
    this.data = {
      labels: [-10, 0, 10, 20, 30, 40, 50, 60],
      datasets: [
        {
          label: 'First Dataset',
          data: [1.2,30,23,30,45,50], // Line 2
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
          display: true,
          title: {
            display: true,
            text: 'Temperatura de bulbo seco (°C)'
          },
          ticks: {
            stepSize: 1
          },
          min: 0,
          max: 60
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Entalpía (kJ/kg)'
          },
          min: 0,
          max: 100
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          title: {
            display: true,
            text: 'Razón de humedad (Kg/Kg)'
          },
          min: 0,
          max: 0.04
        },
        y2: {
          display: false,
          beginAtZero: true,
          position: 'right',
          min: 0,
          max: 0.04,
        },
      }
    };
  }

}
