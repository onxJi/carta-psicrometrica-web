import { Component } from '@angular/core';
import { GraficaComponent } from '../../components/grafica/grafica.component';
import { AltitudComponentComponent } from '../../components/altitud-component/altitud-component.component';

@Component({
  selector: 'app-carta-psicrometrica-home',
  standalone: true,
  imports: [GraficaComponent, AltitudComponentComponent],
  templateUrl: './carta-psicrometrica-home.component.html',
  styleUrl: './carta-psicrometrica-home.component.css',
  host: {
    style: "width: 100%"
  }
})
export default class CartaPsicrometricaHomeComponent {

}
