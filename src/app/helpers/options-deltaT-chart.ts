import { reverse } from "dns";

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
        }
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
            min: 10,
            max: 50
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Humedad relativa (%)'
            },
            min: 0,
            max: 100,
            type: 'linear',
        },
        y1: {
            beginAtZero: true,
            type: 'linear',
            position: 'right',
            title: {
                display: true,
                text: 'Delta T (∆T)'
            },
            min: 0,
            max: 20,
            reverse: true
        }
    }
}