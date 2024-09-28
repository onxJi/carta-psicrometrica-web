import { Component, OnInit, signal } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { style } from '@angular/animations';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { Ecuations } from '../../shared/maths/Ecuaciones.ecuation';

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
  ecuations = new Ecuations();
  options: any;
  datasets: any[] = [];
  altitudValue = signal(0);
  tbs_range = Array.from({ length: 15 }, (_, i) => i * 5 - 10);
  hr_range = Array.from({ length: 11 }, (_, i) => i * 10);
  constructor(
    private altitudService: AltitudeService
  ) { }

  ngOnInit(): void {

    this.altitudService.altitude$.subscribe(altitud => {
      const altitudValue = altitud ?? 0;
      this.altitudValue.set(altitudValue);
      // Limpiar el datasets antes de calcular la gráfica
      this.datasets = []; // Limpiar datasets

      this.calcularGrafica();
      this.calculoLineasTbh();
      this.calculoLineasHumedad();
    });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: this.tbs_range,
      datasets: this.datasets
    };

    this.options = {
      type: 'line',
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      elements: {
        point: {
          radius: 0.5
        }
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          },
          display: false
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
          type: 'linear',  // Asegúrate de que el eje X sea lineal
          position: 'bottom',
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
          max: 100,
          type: 'linear',
        },
        y1: {
          beginAtZero: true,
          type: 'linear',
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
          type: 'linear',
          min: 0,
          max: 0.04,
        },
      }
    };
  }


  calcularGrafica() {
    const alt = this.altitudValue();
    let data: any[] = [];
    const documentStyle = getComputedStyle(document.documentElement);

    this.tbs_range.forEach(tbs => {
      const { pv, W, U, Tbh, Tr, Veh, h, pvs, Ws } = this.ecuations.main(tbs, 100, alt);
      this.datasets.push({
        label: `Tbs = ${tbs}`,  // Etiqueta para identificar cada serie
        data: [
          {
            x: tbs,  // Usamos 'tbs' para el eje X
            y: 0     // Iniciamos en y = 0
          },
          {
            x: tbs,  // Usamos 'tbs' para el eje X (mismo valor)
            y: Ws    // Aquí definimos el valor de y correspondiente a 'Ws' (similar a Python)
          }
        ],
        showLine: true,  // Muestra líneas en lugar de puntos sueltos
        fill: false,     // No rellenamos debajo de la línea
        backgroundColor: 'rgb(255, 0, 0)',  // Color de los puntos o línea
        borderColor: 'rgb(255, 0, 0)',      // Color de la línea
        borderWidth: 2,    // Grosor de la línea
        yAxisID: 'y1'      // Definimos el eje Y que queremos usar
      });
    });

  }


  calculoLineasHumedad() {
    let W_range: { [key: number]: { x: number, y: number }[] } = {};

    this.hr_range.forEach(hr => {
      // Inicializar el array de la clave hr si no existe
      if (!W_range[hr]) {
        W_range[hr] = [];
      }
      this.tbs_range.forEach(tbs => {
        const { W } = this.ecuations.main(tbs, hr, this.altitudValue());
        // Agregar el punto { x: tbs, y: W } al array correspondiente
        W_range[hr].push({ x: tbs, y: W });
      });
    });

    // Generar los datasets para la gráfica
    Object.keys(W_range).forEach(hrStr => {
      const hr = Number(hrStr);  // Convertir la clave a número
      const dataPoints = W_range[hr];  // Los puntos para este valor de hr

      // Crear un dataset para cada valor de hr
      this.datasets.push({
        label: `HR = ${hr}`,  // Etiqueta para identificar cada serie
        data: dataPoints,  // Puntos x, y para graficar
        showLine: true,  // Muestra las líneas conectando los puntos
        backgroundColor: 'rgba(255, 100, 0, 0.5)',  // Color de fondo de los puntos
        borderColor: 'rgb(255, 100, 0)',  // Color de la línea
        borderWidth: 1,  // Grosor de la línea
        yAxisID: 'y1'  // Eje Y a usar
      });
    });

  }

  calculoLineasTbh() {
    const tbhRange: { tbs: number, Yas: number, tg: number, Ya: number }[] = [];

    this.tbs_range.forEach((tbs) => {
      const result_ = this.ecuations.main(tbs, 100, this.altitudValue());
      const lambdaV = this.ecuations.lamba_v(tbs);
      const Yas = result_.Ws;
      //tbhRange.push({ tbs, Yas, tg: (((lambdaV / 0.227) * Yas) + tbs), Ya: 0 });
      const tg = (((lambdaV / 0.227) * Yas) + tbs);
      this.datasets.push({
        label: `Tbh = ${result_.Tbh}`,  // Etiqueta para identificar cada serie
        data: [{ x: tg, y: 0 }, { x: tbs, y: Yas }],
        showLine: true,  // Muestra líneas en lugar de puntos sueltos
        backgroundColor: 'rgb(255, 100, 0)',  // Color de los puntos o línea
        borderColor: 'rgb(255, 100, 0)',      // Color de la línea
        borderWidth: 1,    // Grosor de la línea
        yAxisID: 'y1'      // Definimos el eje Y que queremos usar
      })
    });
    console.log(this.datasets)
  }
}
