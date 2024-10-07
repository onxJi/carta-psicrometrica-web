import { reverse } from "dns";
let delayed: boolean = false;
export const optionsDeltaTChart = {
    type: 'line',
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    elements: {
        point: {
            radius: 1
        }
    },
    plugins: {
        legend: {
            labels: {
                color: 'black'
            },
            display: false
        },
        titleRotationPlugin: {
            enabled: true // Habilita el plugin personalizado
        }
    },
    animation: {
        onComplete: () => {
            delayed = true;
        },
        delay: (context: any) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
        },
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Temperatura de bulbo seco (°C)'
            },
            ticks: {
                stepSize: 1
            },
            type: 'linear',  // Asegúrate de que el eje X sea lineal
            position: 'bottom',
            min: 1,
            max: 40
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Humedad relativa (%)'
            },
            min: 10,
            max: 100,
            type: 'linear',
        },
        y1: {
            beginAtZero: false,
            type: 'linear',
            position: 'right',
            title: {
                display: true,
                text: 'Delta T (∆T)',
            },
            min: 0,
            max: 20,
            reverse: true
        }
    }
}