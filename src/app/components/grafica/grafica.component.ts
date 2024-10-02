import { Component, OnInit, signal, viewChild } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { style } from '@angular/animations';
import { Chart } from 'chart.js';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { Ecuations } from '../../shared/maths/Ecuaciones.ecuation';
import { PsychrometricData } from '../../models/entities/PsychrometricData.model';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { PointsService } from '../../services/points.service';

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [PrimeNgExportModule, CustomTableComponent],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css',
  host: {
    style: 'width: 100%; max-width: 100%; overflow: hidden;'
  }
})
export class GraficaComponent implements OnInit {

  pointsData = signal<PsychrometricData[]>([]);
  // Tabla
  headers = [
    { header: 'Tbs', field: 'tbs' },
    { header: 'Tbh', field: 'Tbh' },
    { header: 'Veh', field: 'Veh' },
    { header: 'h', field: 'h' },
    { header: 'U', field: 'U' },
    { header: 'Humedad Relativa', field: 'hr' },
    { header: 'Ws', field: 'Ws' },
  ];
  data = signal({});
  ecuations = new Ecuations();
  options: any;
  datasets = signal<any[]>([]);
  altitudValue = signal(0);
  tbs_range = Array.from({ length: 15 }, (_, i) => i * 5 - 10);
  hr_range = Array.from({ length: 11 }, (_, i) => i * 10);
  constructor(
    private altitudService: AltitudeService,
    private pointService: PointsService
  ) { }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data.set({
      labels: this.tbs_range,
      datasets: this.datasets
    });

    this.altitudService.altitude$.subscribe(altitud => {
      const altitudValue = altitud ?? 0;
      this.altitudValue.set(altitudValue);
      // Limpiar el datasets antes de calcular la gráfica
      this.datasets.set([]); // Limpiar datasets

      this.calcularGrafica();
      this.calculoLineasTbh();
      this.calculoLineasHumedad();

      // Actualizar la data con los nuevos datasets
      this.data.update(currentData => ({
        ...currentData,
        datasets: this.datasets()
      }));
    });

    this.pointService.formData$.subscribe(points => {
      if (points) {
        this.calcularPuntos(points);
      }
    });

    this.options = {
      type: 'line',
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      elements: {
        point: {
          radius: 1
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
      const { Ws } = this.ecuations.main(tbs, 100, alt);
      // Usar `update` para modificar el valor de `datasets`
      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `Tbs = ${tbs}`,  // Etiqueta para identificar cada serie
          data: [
            { x: tbs, y: 0 },  // Iniciamos en y = 0
            { x: tbs, y: Ws }  // Definimos el valor de y correspondiente a 'Ws'
          ],
          showLine: true,
          fill: false,
          backgroundColor: 'rgb(255, 0, 0)',
          borderColor: 'rgb(255, 0, 0)',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]);
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
      const hr = Number(hrStr);
      const dataPoints = W_range[hr];

      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `HR = ${hr}`,
          data: dataPoints,
          showLine: true,
          backgroundColor: 'rgba(255, 100, 0, 0.5)',
          borderColor: 'rgb(255, 100, 0)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]);
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
      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `Tbh = ${result_.Tbh}`,
          data: [{ x: tg, y: 0 }, { x: tbs, y: Yas }],
          showLine: true,
          backgroundColor: 'rgb(255, 100, 0)',
          borderColor: 'rgb(255, 100, 0)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]);
    });

  }

  calcularPuntos(data: any) {
    const result = this.ecuations.main(+data.tbs, +data.hr, this.altitudValue());

    // Actualizar el valor de `pointsData` con el nuevo punto
    this.pointsData.update(currentPointsData => [
      ...currentPointsData,
      {
        tbs: +data.tbs,
        pv: result.pv,
        W: result.W,
        U: result.U,
        Tbh: result.Tbh,
        Tr: result.Tr,
        Veh: result.Veh,
        h: result.h,
        pvs: result.pvs,
        Ws: result.Ws,
        hr: +data.hr
      }
    ]);

    this.datasets.update(currentDatasets => [
      ...currentDatasets,
      {
        label: `Punto (${data.tbs}, ${data.hr})`,
        data: [{ x: +data.tbs, y: result.Ws }],
        showLine: false,
        backgroundColor: 'rgb(0, 255, 0)',
        borderColor: 'rgb(0, 255, 0)',
        pointRadius: 4, // Grosor del punto
        pointHoverRadius: 4,
        borderWidth: 2,
        yAxisID: 'y2'
      }
    ]);

    // Actualizar la data con los nuevos datasets
    this.data.update(currentData => ({
      ...currentData,
      datasets: this.datasets()
    }));

    console.log(this.datasets());
  }
}
