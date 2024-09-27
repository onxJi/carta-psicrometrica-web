import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export class Validaciones {
    static correoValidacion =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static numTelefonico = /[^\d]+$/;
    static stringSantize = /[#-.]|[[-^]|[?|{}]/g;

    static atLeastTwoFields(group: FormGroup): { [key: string]: boolean } | null {
        const values = Object.values(group.value);
        const filledFields = values.filter(
            (value) => value !== null && value !== ''
        );

        if (filledFields.length >= 2) {
            return null;
        }

        return { atLeastTwoFields: true };
    }

    static trimValidator(control: FormControl) {
        if (control?.value && control.value.toString().trim() === '') {
            control.setValue('', { emitEvent: false });
            return {
                required: true,
            };
        }
        return null;
    }

    static trimValidatorWithoutError(control: FormControl) {
        if (control?.value && control.value.toString().trim() === '') {
            control.setValue('', { emitEvent: false });
        }
    }

    static onlyNumbers(control: FormControl) {
        if (control?.value && control.value.toString().trim() !== '') {
            const soloEnteros = /[^\d]+$/;
            if (soloEnteros.test(control.value)) {
                const controlLimpio = String(control.value).replace(soloEnteros, '');
                control.setValue(controlLimpio);
            }
        }
    }
    static onlyNumbersAsync(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise(resolve => {
            const soloNumerosDecimales = /^[0-9]+(\.[0-9]*)?$/;
            const isValid = soloNumerosDecimales.test(control.value);
            resolve(isValid ? null : { invalidNumber: true });
        });
    }

    static onlyNumbersF(control: AbstractControl): ValidationErrors | null {
        if (control?.value && control.value.toString().trim() !== '') {
            // Expresión regular para permitir solo números con un solo punto decimal
            const soloNumerosDecimales = /^[0-9]+(\.[0-9]*)?$/;

            // Si el valor no coincide con la expresión regular
            if (!soloNumerosDecimales.test(control.value)) {
                // Reemplazar caracteres no numéricos y puntos adicionales
                const valorLimpio = String(control.value).replace(/[^0-9.]/g, ''); // Elimina cualquier carácter que no sea dígito o punto
                const soloUnPunto = valorLimpio.replace(/(\..*)\./g, '$1'); // Mantiene solo un punto decimal
                control.setValue(soloUnPunto); // Actualiza el valor en el control

                return { invalidNumber: true };  // Retorna un error si había caracteres no válidos
            }
        }

        // Si pasa la validación, no hay error
        return null;
    }

    static onlyNumbersFloat(control: FormControl) {
        if (control?.value && control.value.toString().trim() !== '') {
            // Expresión regular para permitir solo números y un punto decimal
            const soloNumerosDecimales = /^[0-9]+(\.[0-9]*)?$/;

            // Si el valor no coincide con la expresión regular, limpiamos el control
            if (!soloNumerosDecimales.test(control.value)) {
                const controlLimpio = String(control.value).replace(/[^0-9.]/g, ''); // Solo dejamos números y punto
                const soloUnPunto = controlLimpio.replace(/(\..*)\./g, '$1'); // Elimina puntos adicionales
                control.setValue(soloUnPunto);
            }
        }
        return null;
    }

    static onlyLetters(control: FormControl) {
        if (control?.value && control.value.toString().trim() !== '') {
            const soloLetrasYEspacios = /^[a-zA-Z\s]+$/;
            if (!soloLetrasYEspacios.test(control.value)) {
                const controlLimpio = String(control.value).replace(/[^a-zA-Z\s]/g, '');
                control.setValue(controlLimpio);
            }
        }
    }
}