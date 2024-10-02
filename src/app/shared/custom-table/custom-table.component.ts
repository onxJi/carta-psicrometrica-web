import { Component, input, output, viewChild } from '@angular/core';
import { PrimeNgExportModule } from '../primengExportModule/PrimeNgExportModule.module';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { style } from '@angular/animations';

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
  paginaActual = output<number>();
  selectionType = null;
  selection: any;
  first = 0;


  cambiarPagina($event: TableLazyLoadEvent) {
    const page = $event.first! / $event.rows! || 0;
    this.paginaActual.emit(page);
  }

  // Obtener valores anidados para mostrarlos en la tabla
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc[part], obj);
  }

}
