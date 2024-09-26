import { Component } from '@angular/core';
import { PrimeNgExportModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-altitud-component',
  standalone: true,
  imports: [PrimeNgExportModule, ReactiveFormsModule],
  templateUrl: './altitud-component.component.html',
  styleUrl: './altitud-component.component.css',
  host:{
    style: 'width: 100%'
  }
})
export class AltitudComponentComponent {

  formAlt = this.fb.group({
    altitud: [0, Validators.required]
  })

  constructor(
    private fb: FormBuilder
  ) { }
}
