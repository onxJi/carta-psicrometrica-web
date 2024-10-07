import { Component } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { PointsService } from '../../services/points.service';
import { AltitudeService } from '../../services/altitud-service/altitudeService.service';
import { Validaciones } from '../../helpers/validaciones';
import { PointsDeltaTService } from '../../services/points-delta-t.service';

@Component({
  selector: 'app-delta-t-parametros',
  standalone: true,
  imports: [PrimeNgExportModule, ReactiveFormsModule, CustomTableComponent],
  templateUrl: './delta-t-parametros.component.html',
  styleUrl: './delta-t-parametros.component.css'
})
export class DeltaTParametrosComponent {
  formAlt = this.fb.group({
    altitud: [0, Validators.compose([Validators.required, Validaciones.onlyNumbersF])],
    vel_viento: [null, Validators.compose([Validators.required, Validaciones.onlyNumbersF])] // El segundo parámetro debe ser un array de validadores
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
    private pointService: PointsDeltaTService
  ) { }


  calcular() {
    const altitud = this.formAlt.get('altitud')?.value!;
    const vel_viento = +this.formAlt.get('vel_viento')?.value!;
    this.altitudeService.updateAltitudYVelocidad(altitud, vel_viento);
    console.log(altitud, vel_viento);

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
