import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  // Usamos BehaviorSubject para que otros componentes puedan suscribirse y obtener el valor actual
  private formData = new BehaviorSubject<{ tbs: number, hr: number } | null>(null);

  // Observable al que los otros componentes pueden suscribirse
  formData$ = this.formData.asObservable();

  // Método para actualizar los datos
  updateFormData(tbs: number, hr: number) {
    this.formData.next({ tbs, hr });
  }
}
