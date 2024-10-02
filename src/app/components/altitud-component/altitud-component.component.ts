import { Component, signal } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { Validaciones } from '../../helpers/validaciones';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { PsychrometricData } from '../../models/entities/PsychrometricData.model';
import { PointsService } from '../../services/points.service';

@Component({
  selector: 'app-altitud-component',
  standalone: true,
  imports: [PrimeNgExportModule, ReactiveFormsModule, CustomTableComponent],
  templateUrl: './altitud-component.component.html',
  styleUrl: './altitud-component.component.css',
  host: {
    style: 'width: 100%'
  }
})
export class AltitudComponentComponent {

  formAlt = this.fb.group({
    altitud: [0, Validators.compose([Validators.required, Validaciones.onlyNumbersF])]  // El segundo parámetro debe ser un array de validadores
  });

  formPoints = this.fb.group({
    tbs: [null, Validators.compose([Validators.required, Validaciones.onlyNumbersF])],
    hr: [null, Validators.compose([Validators.required, Validaciones.onlyNumbersF])],
    color: ['#000', Validators.required]
  });

  get color() {
    return this.formPoints.get('color')?.value
  }
  constructor(
    private fb: FormBuilder,
    private altitudeService: AltitudeService,
    private pointService: PointsService
  ) { }


  calcular() {
    const altitud = this.formAlt.get('altitud')?.value;
    if (altitud) {
      this.altitudeService.updateAltitude(altitud);
    }
  }

  calcularPuntos() {
    const tbs = this.formPoints.get('tbs')?.value!;
    const hr = this.formPoints.get('hr')?.value!;
    const color = this.formPoints.get('color')?.value!;
    if (tbs && hr) {
      this.pointService.updateFormData(tbs, hr, color);
      this.formPoints.reset();
    }
  }
}
