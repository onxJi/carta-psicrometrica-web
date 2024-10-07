import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AltitudeService {
    private altitudeSubject = new BehaviorSubject<number | null>(null);
    private altYvelSubject = new BehaviorSubject<{ alt: number, vel_viento: number }>({ alt: 0, vel_viento: 0 });
    // Observable para el valor de altitud
    altitude$ = this.altitudeSubject.asObservable();
    altYvel$ = this.altYvelSubject.asObservable();
    // Método para actualizar el valor de altitud
    updateAltitude(value: number) {
        this.altitudeSubject.next(value);
    }

    updateAltitudYVelocidad(altitud: number, vel_viento: number) {
        this.altYvelSubject.next({ alt: altitud, vel_viento });
    }
}
