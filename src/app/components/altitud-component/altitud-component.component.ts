import { Component } from '@angular/core';
import { PrimeNgExportModuleModule } from '../../shared/primengExportModule/PrimeNgExportModule.module';

@Component({
  selector: 'app-altitud-component',
  standalone: true,
  imports: [PrimeNgExportModuleModule],
  templateUrl: './altitud-component.component.html',
  styleUrl: './altitud-component.component.css'
})
export class AltitudComponentComponent {

}
