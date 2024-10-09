import { Component, OnInit, signal } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { Ecuations } from '../../shared/maths/Ecuaciones.ecuation';
import { PsychrometricData } from '../../models/entities/PsychrometricData.model';
import { optionsDeltaTChart } from '../../helpers/options-deltaT-chart';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { PointsDeltaTService } from '../../services/points-delta-t.service';
import { deltaT_table } from '../../helpers/ValuesDeltaT';
import { roundToInternationalSystem } from '../../helpers/redondeoSI.helper';

@Component({
  selector: 'app-grafica-delta-t',
  standalone: true,
  imports: [PrimeNgExportModule, CustomTableComponent],
  templateUrl: './grafica-delta-t.component.html',
  styleUrl: './grafica-delta-t.component.css',
  host: {
    style: 'width: 100%; max-width: 100%; overflow: hidden;'
  }
})
export class GraficaDeltaTComponent implements OnInit {
  pointsData = signal<PsychrometricData[]>([]);
  // Tabla
  headers = [
    { header: 'Tbs', field: 'tbs' , tool: "Temperatura de bulbo seco"},
    { header: 'HR %', field: 'hr', tool: "Humedad Relativa %" },
    { header: 'Tbh', field: 'Tbh', tool: "Temperatura de bulbo humedo" },
    { header: 'Delta T (∆T)', field: 'deltaT', tool: "Delta T indicador" },
  ];
  data = signal({});
  ecuations = new Ecuations();
  options: any;
  datasets = signal<any[]>([]);
  altitudValue = signal(0);
  vel_viento = signal(0);
  // Temperatura de bulbo seco (tbs) de 0 a 50 en incrementos de 5 (10 elementos)
  tbs_range = Array.from({ length: 11 }, (_, i) => i * 5);

  // Humedad relativa (hr) de 0 a 100 en incrementos de 10 (10 elementos)
  hr_range = Array.from({ length: 11 }, (_, i) => i * 10);

  constructor(
    private altitudService: AltitudeService,
    private pointService: PointsDeltaTService
  ) { }

  ngOnInit(): void {
    this.data.set({
      labels: this.tbs_range,
      datasets: this.datasets
    });
    this.options = optionsDeltaTChart;

    this.altitudService.altYvel$.subscribe(({ alt, vel_viento }) => {
      const altitudValue = alt ?? 0;
      const vel = vel_viento ?? 0;
      this.altitudValue.set(altitudValue);
      this.vel_viento.set(vel);
      // Limpiar el datasets antes de calcular la gráfica
      this.datasets.set([]); // Limpiar datasets

      this.calcularGrafica();
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
  }

  calcularVelocidadViento(vel_viento: number) {
    if (vel_viento >= 0 && vel_viento <= 0.5) {
      return 0.00120;
    }
    if (vel_viento > 0.5 && vel_viento <= 1.5) {
      return 0.00080;
    }
    if (vel_viento > 1.5 && vel_viento <= 4) {
      return 0.00066;
    }
    if (vel_viento > 4 && vel_viento <= 10) {
      return 0.00064;
    }
    return 0;
  }

  calcularGrafica() {
    console.log('Calculando grafica');
    const altitud = this.altitudValue();
    let W_range: { [key: number]: { x: number, y: number }[] } = {};

    const deltaT_range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    let deltaT_values: { [key: number]: { x: number, y: number }[] } = {}

    deltaT_range.forEach(delta => {
      if (!deltaT_values[delta]) {
        deltaT_values[delta] = [];
      }
      this.tbs_range.forEach(tbs => {
        const Tbh = tbs - delta;
        const pvs = roundToInternationalSystem(this.ecuations.pvsHpa(Tbh), 4);
        const a1 = this.calcularVelocidadViento(this.vel_viento());
        const pv = roundToInternationalSystem(this.ecuations.pvHpa(pvs, tbs, Tbh, this.altitudValue(), a1),4);
        const hr = roundToInternationalSystem((pv / pvs) * 100,4);
        deltaT_values[delta].push({ x: tbs, y: hr });
      })
    });

    //deltaT_values = deltaT_table



    Object.keys(deltaT_values).forEach(delta => {
      const dT = Number(delta);
      const dataPoints = deltaT_values[dT];


      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `Delta = ${delta}`,
          data: dataPoints,
          showLine: true,
          borderColor: dT % 2 === 0 ? 'black' : this.getColorForDeltaT(dT),
          backgroundColor: this.getColorForDeltaT(dT),
          borderWidth: 1,
          yAxisID: 'y',
          fill: '-1'
        }
      ]);
    })


    // this.hr_range.forEach(hr => {
    //   // Inicializar el array de la clave hr si no existe
    //   if (!W_range[hr]) {
    //     W_range[hr] = [];
    //   }
    //   this.tbs_range.forEach(tbs => {
    //     const { Tbh } = this.ecuations.main(tbs, hr, this.altitudValue());

    //     // calcular delta T
    //     const deltaT = tbs - Tbh;
    //     //console.log(`Tbs: ${tbs}, HR: ${hr}, Tbh: ${Tbh}, deltaT: ${deltaT}`);
    //     // Agregar el punto { x: tbs, y: W } al array correspondiente
    //     W_range[hr].push({ x: tbs, y: deltaT });
    //   });
    // });

    // console.log(W_range)

    // // Crear los datasets
    // Object.keys(W_range).forEach(tbsStr => {
    //   const tbs = Number(tbsStr);
    //   const dataPoints = W_range[tbs];

    //   this.datasets.update(currentDatasets => [
    //     ...currentDatasets,
    //     {
    //       label: `HR = ${tbs}`,
    //       data: dataPoints,
    //       showLine: true,
    //       backgroundColor: this.getColorForDeltaT(Math.max(...dataPoints.map(d => d.y))),
    //       borderColor: this.getColorForDeltaT(Math.max(...dataPoints.map(d => d.y))),
    //       borderWidth: 1,
    //       yAxisID: 'y1',
    //       fill: '-1'
    //     }
    //   ]);
    // });

  }

  // Función para determinar color según el valor de ΔT
  getColorForDeltaT(deltaT: number): string {
    if (deltaT <= 2) return 'rgba(255,200,0,0.5)'; // Banda de aplicación
    if (deltaT >= 2 && deltaT <= 8) return 'rgba(0,255,0,0.5)';
    if (deltaT >= 8 && deltaT <= 10) return 'rgba(255,200,0,0.5)' // Banda de condiciones marginales
    return 'rgba(255,0,0,0.5)'; // Banda de no aplicación
  }


  calcularPuntos(data: any) {
    const result = this.ecuations.main(+data.tbs, +data.hr, this.altitudValue());
    const P = 1013.3 / Math.exp(this.altitudValue() / (8430.15 - this.altitudValue() * 0.09514));
    const a1 = this.calcularVelocidadViento(this.vel_viento());
    let tbh = this.calcularTbh(+data.tbs, +data.hr, a1, P);
    tbh = roundToInternationalSystem(tbh,4)
    let deltaT = +data.tbs - tbh;
    deltaT = roundToInternationalSystem(deltaT,4)
    // Actualizar el valor de `pointsData` con el nuevo punto
    this.pointsData.update(currentPointsData => [
      ...currentPointsData,
      {
        tbs: +data.tbs,
        Tbh: tbh,
        hr: +data.hr,
        deltaT: deltaT,
      }
    ]);

    this.datasets.update(currentDatasets => [
      ...currentDatasets,
      {
        label: `Delta ( ${deltaT})`,
        data: [{ x: +data.tbs, y: +data.hr }],
        showLine: false,
        backgroundColor: data.color,
        borderColor: data.color,
        pointRadius: 4, // Grosor del punto
        pointHoverRadius: 4,
        borderWidth: 2,
        yAxisID: 'y',
        zIndex: 1000
      }
    ]);

    // Actualizar la data con los nuevos datasets
    this.data.update(currentData => ({
      ...currentData,
      datasets: this.datasets()
    }));


  }

  calcularTbh(tbs: number, hr: number, a1: number, P: number) {
    const tolerance = 0.0001; // Tolerancia para el cálculo numérico
    let low = 0; // Límite inferior para tbh
    let high = tbs; // Límite superior para tbh
    let tbh = (low + high) / 2; // Inicialización de tbh

    while (high - low > tolerance) {
      const expFactorTbh = Math.exp((17.27 * tbh) / (237.3 + tbh)); // e^(17.27 * tbh / (237.3 + tbh))
      const pvs_tbh = 6.11 * expFactorTbh; // pvs a tbh

      const leftSide = (hr / 100) * pvs_tbh; // (hr / 100) * pvs(tbh)

      const rightSide = pvs_tbh - a1 * P * (tbs - tbh); // pvs(tbh) - a1 * P * (tbs - tbh)

      // Comparamos los lados de la ecuación para ajustar los límites
      if (leftSide < rightSide) {
        high = tbh;
      } else {
        low = tbh;
      }

      // Recalcular tbh como el punto medio de los nuevos límites
      tbh = (low + high) / 2;
    }

    return tbh;
  }




}
