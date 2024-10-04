import { Component, OnInit, signal } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { Ecuations } from '../../shared/maths/Ecuaciones.ecuation';
import { PsychrometricData } from '../../models/entities/PsychrometricData.model';
import { optionsDeltaTChart } from '../../helpers/options-deltaT-chart';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { PointsDeltaTService } from '../../services/points-delta-t.service';
import { deltaT_table } from '../../helpers/ValuesDeltaT';

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
    { header: 'Tbs', field: 'tbs' },
    { header: 'HR %', field: 'hr' },
    { header: 'Tbh', field: 'Tbh' },
    { header: 'Tr', field: 'Tr' },
    { header: 'Veh', field: 'Veh' },
    { header: 'h', field: 'h' },
    { header: 'U', field: 'U' },
    { header: 'Ws', field: 'Ws' },
    { header: 'W', field: 'W' },
    { header: 'Pv', field: 'pv' },
    { header: 'Pvs', field: 'pvs' }
  ];
  data = signal({});
  ecuations = new Ecuations();
  options: any;
  datasets = signal<any[]>([]);
  altitudValue = signal(0);
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
    this.altitudService.altitude$.subscribe(altitud => {
      const altitudValue = altitud ?? 0;
      this.altitudValue.set(altitudValue);
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

  calcularGrafica() {
    console.log('Calculando grafica');
    const altitud = this.altitudValue();
    let W_range: { [key: number]: { x: number, y: number }[] } = {};

    const deltaT_range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    let deltaT_values: { [key: number]: { x: number, y: number }[] } = {}

    deltaT_range.forEach(delta => {
      if (!deltaT_values[delta]) {
        deltaT_values[delta] = [];
      }
      this.tbs_range.forEach(tbs => {
        const tk = tbs + 273.15;
        const Tbh = tbs - delta;
        const pvs = this.ecuations.pvsHpa(Tbh);
        const a1 = 0.00120;
        const pv = this.ecuations.pvHpa(pvs,tbs,Tbh,this.altitudValue(),a1);
        const hr = (pv / pvs)*100;
        deltaT_values[delta].push({x: tbs, y: hr});
      })
    });

    //deltaT_values = deltaT_table
    console.log(deltaT_values)


    Object.keys(deltaT_values).forEach(delta => {
      const dT = Number(delta);
      const dataPoints = deltaT_values[dT];

      
      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `Delta = ${delta}`,
          data: dataPoints,
          showLine: true,
          borderColor: dT % 2 === 0 ? 'black'  :this.getColorForDeltaT(dT),
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
    const deltaT = +data.tbs - result.Tbh;
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
        data: [{ x: +data.tbs, y: deltaT }],
        showLine: false,
        backgroundColor: data.color,
        borderColor: data.color,
        pointRadius: 4, // Grosor del punto
        pointHoverRadius: 4,
        borderWidth: 2,
        yAxisID: 'y1',
        zIndex: 1000
      }
    ]);

    // Actualizar la data con los nuevos datasets
    this.data.update(currentData => ({
      ...currentData,
      datasets: this.datasets()
    }));


  }

}
