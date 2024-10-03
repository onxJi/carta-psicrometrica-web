import { Component, OnInit, signal } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { Ecuations } from '../../shared/maths/Ecuaciones.ecuation';
import { PsychrometricData } from '../../models/entities/PsychrometricData.model';
import { optionsDeltaTChart } from '../../helpers/options-deltaT-chart';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { PointsService } from '../../services/points.service';

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
    private pointService: PointsService
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
  }

  calcularGrafica() {
    console.log('Calculando grafica');
    const altitud = this.altitudValue();
    let W_range: { [key: number]: { x: number, y: number }[] } = {};

    // this.hr_range.forEach(hr => {
    //   // Inicializar el array de la clave hr si no existe
    //   if (!W_range[hr]) {
    //     W_range[hr] = [];
    //   }
    //   this.tbs_range.forEach(tbs => {
    //     const { Tbh } = this.ecuations.main(tbs, hr, this.altitudValue());

    //     // calcular delta T
    //     const deltaT = tbs - Tbh;
    //     console.log(`Tbs: ${tbs}, HR: ${hr}, Tbh: ${Tbh}, deltaT: ${deltaT}`);
    //     // Agregar el punto { x: tbs, y: W } al array correspondiente
    //     W_range[hr].push({ x: tbs, y: deltaT });
    //   });
    // });

    // Iterar sobre cada TBS primero y luego sobre HR
    this.tbs_range.forEach(tbs => {
      // Inicializar el array de la clave tbs si no existe
      if (!W_range[tbs]) {
        W_range[tbs] = [];
      }
      this.hr_range.forEach(hr => {
        const { Tbh } = this.ecuations.main(tbs, hr, altitud);

        // Calcular delta T
        const deltaT = tbs - Tbh;
        // Ignorar valores de deltaT que sean Infinity o NaN
        if (!isFinite(deltaT)) {
          console.log(`Ignorando punto: Tbs: ${tbs}, HR: ${hr}, Tbh: ${Tbh}, deltaT: ${deltaT}`);
          return;
        }
        console.log(`Tbs: ${tbs}, HR: ${hr}, Tbh: ${Tbh}, deltaT: ${deltaT}`);

        // Agregar el punto { x: hr, y: deltaT } al array correspondiente
        W_range[tbs].push({ x: hr, y: deltaT });
      });
    });

    // Crear los datasets
    Object.keys(W_range).forEach(tbsStr => {
      const tbs = Number(tbsStr);
      const dataPoints = W_range[tbs];

      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `TBS = ${tbs}°C`,
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


}
