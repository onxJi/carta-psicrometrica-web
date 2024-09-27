import { Component } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { Validaciones } from '../../helpers/validaciones';

@Component({
  selector: 'app-altitud-component',
  standalone: true,
  imports: [PrimeNgExportModule, ReactiveFormsModule],
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

  constructor(
    private fb: FormBuilder,
    private altitudeService: AltitudeService
  ) { }


  calcular() {
    const altitud = this.formAlt.get('altitud')?.value;
    if (altitud) {
      this.altitudeService.updateAltitude(altitud);
    }
  }
}
