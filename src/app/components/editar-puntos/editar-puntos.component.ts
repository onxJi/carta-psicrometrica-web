import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validaciones } from '../../helpers/validaciones';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PointsService } from '../../services/points.service';
import { PointsDeltaTService } from '../../services/points-delta-t.service';

@Component({
  selector: 'app-editar-puntos',
  standalone: true,
  imports: [PrimeNgExportModule, ReactiveFormsModule,],
  templateUrl: './editar-puntos.component.html',
  styleUrl: './editar-puntos.component.css'
})
export class EditarPuntosComponent implements OnInit {

  
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
    private configDialog: DynamicDialogConfig,
    private pointService: PointsService,
    private deltaPointService: PointsDeltaTService,
    private ref: DynamicDialogRef
  ) { }


  ngOnInit(): void {
    this.iniciarDatos();
  }

  iniciarDatos() {
    if(!this.configDialog.data) return;

    this.formPoints.get("color")?.setValue(this.configDialog.data.color);
    this.formPoints.get("tbs")?.setValue(this.configDialog.data.tbs);
    this.formPoints.get("hr")?.setValue(this.configDialog.data.hr);

  }

  actualizar() {
    if(!this.configDialog.data.deltaT) this.actualizarPuntosCartaPsicrometrica();
    else this.actualizarPuntosDeltaT();
  }

  actualizarPuntosDeltaT() {
    const tbs = this.formPoints.get('tbs')?.value!;
    const hr = this.formPoints.get('hr')?.value!;
    const color = this.formPoints.get('color')?.value!;
    const dataNueva = {
      tbs: +tbs,
      hr: +hr,
      color: color
    }
    if (tbs && hr) {
      this.deltaPointService.updateFormDataNew(this.configDialog.data, dataNueva);
      this.formPoints.reset();
      this.ref.close();
    }
  }

  actualizarPuntosCartaPsicrometrica() {
    const tbs = this.formPoints.get('tbs')?.value!;
    const hr = this.formPoints.get('hr')?.value!;
    const color = this.formPoints.get('color')?.value!;
    const dataNueva = {
      tbs: +tbs,
      hr: +hr,
      color: color
    }
    if (tbs && hr) {
      this.pointService.updateFormDataNew(this.configDialog.data, dataNueva);
      this.formPoints.reset();
      this.ref.close();
    }
  }

}
