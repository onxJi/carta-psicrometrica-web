import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AltitudeService {
    private altitudeSubject = new BehaviorSubject<number | null>(null);

    // Observable para el valor de altitud
    altitude$ = this.altitudeSubject.asObservable();

    // Método para actualizar el valor de altitud
    updateAltitude(value: number) {
        this.altitudeSubject.next(value);
    }
}
