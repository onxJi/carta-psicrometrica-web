// Función de redondeo según el Sistema Internacional
export const roundToInternationalSystem = (value: number, sigFigs: number) => {
    const multiplier = Math.pow(10, sigFigs - Math.floor(Math.log10(Math.abs(value))) - 1);
    const roundedValue = Math.round(value * multiplier) / multiplier;
    return Math.abs(roundedValue - value) === 0.5 * Math.pow(10, -sigFigs)
        ? Math.round(roundedValue / Math.pow(10, -sigFigs)) * Math.pow(10, -sigFigs)
        : roundedValue;
};