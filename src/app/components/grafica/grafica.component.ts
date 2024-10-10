import { Component, OnInit, signal, viewChild } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { style } from '@angular/animations';
import { Chart } from 'chart.js';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { Ecuations } from '../../shared/maths/Ecuaciones.ecuation';
import { PsychrometricData } from '../../models/entities/PsychrometricData.model';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { PointsService } from '../../services/points.service';
import { optionsPsychrometricChart } from '../../helpers/options-psychrometric-chart';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AltitudComponentComponent } from '../altitud-component/altitud-component.component';
import { EditarPuntosComponent } from '../editar-puntos/editar-puntos.component';


@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [PrimeNgExportModule, CustomTableComponent],
  providers:[
    DialogService,
    ConfirmationService
  ],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css',
  host: {
    style: 'width: 100%; max-width: 100%; overflow: hidden;'
  }
})
export class GraficaComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  pointsData = signal<PsychrometricData[]>([]);
  // Tabla
  headers = [
    { header: 'Tbs', field: 'tbs', tool: "Temperatura de bulbo seco" },
    { header: 'HR %', field: 'hr', tool: "Humedad Relativa en %" },
    { header: 'Tbh', field: 'Tbh', tool: "Temperatura de bulbo húmedo" },
    { header: 'Tr', field: 'Tr' , tool: "Temperatura de punto de rocío"},
    { header: 'Veh', field: 'Veh', tool: "Volumen especifico" },
    { header: 'h', field: 'h' , tool: "Entalpía"},
    { header: 'U', field: 'U', tool: "Grado saturación" },
    { header: 'Ws', field: 'Ws', tool: "Razón de humedad a saturación" },
    { header: 'W', field: 'W', tool: "Razón de humedad" },
    { header: 'Pv', field: 'pv', tool: "Presión de vapor parcial" },
    { header: 'Pvs', field: 'pvs', tool: "Presión de vapor a saturación" }
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
    private pointService: PointsService,
    private messageService: MessageService,
    private dialog: DialogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

    this.data.set({
      labels: this.tbs_range,
      datasets: this.datasets
    });

    this.options = optionsPsychrometricChart;

    this.altitudService.altitude$.subscribe(altitud => {
      const altitudValue = altitud ?? 0;
      this.altitudValue.set(altitudValue);
      // Limpiar el datasets antes de calcular la gráfica
      this.datasets.set([]); // Limpiar datasets

      this.calcularGrafica();
      this.calculoLineasTbh();
      this.calculoLineasHumedad();
      this.actualizarGraficaPuntos();
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

    this.pointService.formDataNew$.subscribe( datos => {
      if(!datos?.dataAnterior && !datos?.dataNueva) return;
      this.editarPuntos(datos.dataAnterior,datos.dataNueva);
    } )

  }


  calcularGrafica() {
    const alt = this.altitudValue();

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
        hr: +data.hr,
        color: data.color
      }
    ]);

    this.datasets.update(currentDatasets => [
      ...currentDatasets,
      {
        label: `Punto (${data.tbs}, ${data.hr})`,
        data: [{ x: +data.tbs, y: result.W }],
        showLine: false,
        backgroundColor: data.color,
        borderColor: data.color,
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

    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Se ha graficado el dato correctamente' })

  }


  actualizarGraficaPuntos() {
    if (this.pointsData().length === 0) return;

    this.pointsData().forEach((data) => {
      this.datasets.update(currentDatasets => [
        ...currentDatasets,
        {
          label: `Punto (${data.tbs}, ${data.hr})`,
          data: [{ x: +data.tbs!, y: data.W }],
          showLine: false,
          backgroundColor: 'rgb(0, 255, 0)',
          borderColor: 'rgb(0, 255, 0)',
          pointRadius: 4, // Grosor del punto
          pointHoverRadius: 4,
          borderWidth: 2,
          yAxisID: 'y2'
        }
      ]);
    });

  }

  editarDatos(data: any) {
    this.ref = this.dialog.open(EditarPuntosComponent, {
      header: 'Editar Datos',
      width: 'auto',
      data: data,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

   
  }

  editarPuntos(dataAnterior: any, nuevaData: any) {
    // Actualizar el punto en pointsData
    const result = this.ecuations.main(+nuevaData.tbs, +nuevaData.hr, this.altitudValue());
    this.pointsData.update(currentPointsData => {
      const index = currentPointsData.findIndex(point => point.tbs === dataAnterior.tbs && point.hr === dataAnterior.hr);
      if (index !== -1) {
        currentPointsData[index] = {
          tbs: +nuevaData.tbs,
          pv: result.pv,
          W: result.W,
          U: result.U,
          Tbh: result.Tbh,
          Tr: result.Tr,
          Veh: result.Veh,
          h: result.h,
          pvs: result.pvs,
          Ws: result.Ws,
          hr: +nuevaData.hr,
          color: nuevaData.color
        };
      }
      return currentPointsData;
    });

    // Actualizar el punto en datasets
    this.datasets.update(currentDatasets => {
      const index = currentDatasets.findIndex(dataset => dataset.label === `Punto (${dataAnterior.tbs}, ${dataAnterior.hr})`);
      if (index !== -1) {
        currentDatasets[index] = {
          label: `Punto (${nuevaData.tbs}, ${nuevaData.hr})`,
          data: [{ x: +nuevaData.tbs, y: result.W }],
          showLine: false,
          backgroundColor: nuevaData.color,
          borderColor: nuevaData.color,
          pointRadius: 4, // Grosor del punto
          pointHoverRadius: 4,
          borderWidth: 2,
          yAxisID: 'y2'
        };
      }
      return currentDatasets;
    });

    // Actualizar la data con los nuevos datasets
    this.data.update(currentData => ({
      ...currentData,
      datasets: this.datasets()
    }));
  }


  eliminarPunto(data: any) {
    this.confirmationService.confirm({
      
      message: '¿Está seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      acceptLabel: "Aceptar",
      rejectLabel: "Cancelar",
      accept: () => {
        this.confirmarEliminacion(data);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Se ha cancelado la eliminación', life: 3000 });
      }
    });
  }


  confirmarEliminacion(data:any) {
    // Eliminar el punto de pointsData
    this.pointsData.update(currentPointsData => {
      const index = currentPointsData.findIndex(point => point.tbs === data.tbs && point.hr === data.hr);
      if (index !== -1) {
        currentPointsData.splice(index, 1);
      }
      return currentPointsData;
    });

    // Eliminar el punto de datasets
    this.datasets.update(currentDatasets => {
      const index = currentDatasets.findIndex(dataset => dataset.label === `Punto (${data.tbs}, ${data.hr})`);
      if (index !== -1) {
        currentDatasets.splice(index, 1);
      }
      return currentDatasets;
    });

    // Actualizar la data con los nuevos datasets
    this.data.update(currentData => ({
      ...currentData,
      datasets: this.datasets()
    }));

    this.messageService.add({ severity: 'success', 
      summary: 'Éxito', 
      detail: 'Se ha eliminado el dato correctamente' 
    });
  }

}
