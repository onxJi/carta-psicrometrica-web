import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PointsDeltaTService {
    // Usamos BehaviorSubject para que otros componentes puedan suscribirse y obtener el valor actual
    private formData = new BehaviorSubject<{ tbs: number, hr: number, color: string } | null>(null);

    // Observable al que los otros componentes pueden suscribirse
    formData$ = this.formData.asObservable();

    // Método para actualizar los datos
    updateFormData(tbs: number, hr: number, color: string) {
        this.formData.next({ tbs, hr, color });
    }
}