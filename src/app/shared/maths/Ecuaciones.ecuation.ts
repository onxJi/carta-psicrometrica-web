export class Ecuations {
    main(tbs: number, hr: number, alt: number) {
        const tk = tbs + 273.15;
        const atm = 101.325 * Math.pow(1 - 2.25577 * Math.pow(10, -5) * alt, 5.2559);
        const pvs = this.presionVaporSaturacion(tk);
        const pv = this.presionVapor(pvs, hr);
        const W = this.razonDeHumedad(pv / 1000, atm);
        const Ws = this.razonHumedadSaturada(pvs, atm);
        const U = this.gradoSaturacion(W, Ws);
        const Veh = this.volumenEspecífico(atm, W, tk);
        const Tr = this.tempPuntoRocio(pv);
        const h = this.entalpia(tbs, W);
        const Tbh = this.tempBulboHumedo(tbs, Tr);
        return { pv, W, U, Tbh, Tr, Veh, h, pvs, Ws };
    }

    presionVaporSaturacion(t: number) {
        const a1 = -5.8002206 * Math.pow(10, 3);
        const a2 = 1.3914993;
        const a3 = -48.640239 * Math.pow(10, -3);
        const a4 = 41.764768 * Math.pow(10, -6);
        const a5 = -14.452093 * Math.pow(10, -9);
        const a6 = 0;
        const a7 = 6.5459673;
        return Math.exp(a1 / t + a2 + a3 * t + a4 * Math.pow(t, 2) + a5 * Math.pow(t, 3) + a6 * Math.pow(t, 4) + a7 * Math.log(t));
    }

    presionVapor(pvs: number, humrel: number) {
        return pvs * (humrel / 100);
    }

    razonDeHumedad(pv: number, atm: number) {
        return 0.622 * (pv / (atm - pv));
    }

    razonHumedadSaturada(pvs: number, atm: number) {
        const pvs_ = pvs / 1000;
        return 0.622 * (pvs_ / (atm - pvs_));
    }

    gradoSaturacion(W: number, Ws: number) {
        return W / Ws;
    }

    volumenEspecífico(atm: number, W: number, t: number) {
        return (287.055 * t) / (atm * 1000) * ((1 + 1.6078 * W) / (1 + W));
    }

    tempPuntoRocio(pv: number) {
        return -35.957 - 1.8726 * Math.log(pv) + 1.1689 * Math.pow(Math.log(pv), 2);
    }

    entalpia(t: number, W: number) {
        return 1.006 * t + W * (2501 + 1.805 * t);
    }

    tempBulboHumedo(t: number, tpr: number) {
        return t - (0.0121 * t + 0.2305) * (t - tpr);
    }

    lamba_v(tbs: number) {
        return 0.4257 * tbs + 597.12;
    }

    vehLinea(vehRango: number, alt: number, tbs: number) {
        let atm = 101.325 * Math.pow(1 - 2.25577 * (Math.pow(10, -5) * (alt)), 5.2559)
        atm = atm * 7.501
        const tk = tbs + 273.15
        const pmAgua = 18
        const pmAire = 29
        const vehLinea = pmAgua * (vehRango * ((atm / atm) / (0.082 * (tk))) - (1 / pmAire))
        return vehLinea
    }


    pvsHpa(t: number) {
        const pvs = 6.11 * Math.exp((17.27 * t) / (237.3 + t));
        //const pvs = Math.exp((60.433 - 6834.271) / (t - 5.16923 * Math.log(t)))
        return pvs
    }


    pvHpa(pvs: number, tbs: number, tbh: number, alt: number, a1: number) {
        const P = 1013.3 / Math.exp(alt / (8430.15 - alt * 0.09514))
        const pv = pvs - a1 * P * (tbs - tbh);
        return pv
    }

    pvTprHpa(tpr: number) {
        const pv = 6.112 * Math.exp((17.27 * tpr) / (237.3 + tpr));
        return pv
    }

    Tpr_tbs(tbs: number, hr: number) {
        const Tpr = tbs + 35 * Math.log10(hr);
        return Tpr
    }




    /* 
    ! Formulas para calcular Hr %

    * Pvs = 6,11 * exp [(17,27 * T) / (237,3 + T)]
    Donde T es la temperatura en ºC y el resultado obtenido (Pvs) es en Hpa
    * Pv = Pvs - 0.66*103 * P * (T - Tbh) * (1 + 1.146 * 103 * Tbh)
    
    */
}