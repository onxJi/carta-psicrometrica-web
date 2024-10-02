import { Component } from '@angular/core';
import { GraficaComponent } from '../grafica/grafica.component';
import { AltitudComponentComponent } from '../altitud-component/altitud-component.component';

@Component({
  selector: 'app-carta-psicrometrica-home',
  standalone: true,
  imports: [GraficaComponent, AltitudComponentComponent],
  templateUrl: './carta-psicrometrica-home.component.html',
  styleUrl: './carta-psicrometrica-home.component.css'
})
export class CartaPsicrometricaHomeComponent {

}
