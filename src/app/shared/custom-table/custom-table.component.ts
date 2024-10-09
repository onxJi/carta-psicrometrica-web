import { Component, input, output, viewChild } from '@angular/core';
import { PrimeNgExportModule } from '../primengExportModule/PrimeNgExportModule.module';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { style } from '@angular/animations';
import { roundToInternationalSystem } from '../../helpers/redondeoSI.helper';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [PrimeNgExportModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css',
  host: {
    class: 'card',
    style: 'width: 100%; margin-top: 20px;'
  }
})
export class CustomTableComponent {

  table = viewChild('table');

  headers = input<any[]>([]);
  acciones = input();
  data = input<any[]>([]);;
  elementosTotales = input(0);
  rows = input(10);
  loading = input(false);
  resetTable = input(false);
  editButton = input(false);
  editOuput = output<any>();
  deleteButton = input(false);
  deleteOutput = output<any>();
  paginaActual = output<number>();

  selectionType = null;
  selection: any;
  first = 0;


  cambiarPagina($event: TableLazyLoadEvent) {
    const page = $event.first! / $event.rows! || 0;
    this.paginaActual.emit(page);
  }

  edit(data: any) {
    this.editOuput.emit(data);
  }
  delete(data: any ){
    this.deleteOutput.emit(data);
  }
  // Obtener valores anidados para mostrarlos en la tabla
  getNestedValue(obj: any, path: string): any {
    const value = path.split('.').reduce((acc, part) => acc[part], obj);
    if (typeof value === 'number') {
      return roundToInternationalSystem(value, 4); // Redondear a 4 cifras significativas
    } else {
      return value;
    }
  }


}
