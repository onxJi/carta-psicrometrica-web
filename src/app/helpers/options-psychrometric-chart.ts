export const optionsPsychrometricChart = {
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
            min: 0,
            max: 60
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Entalpía (kJ/kg)'
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
                text: 'Razón de humedad (kg/kg)'
            },
            min: 0,
            max: 0.08
        },
        y2: {
            display: false,
            beginAtZero: true,
            position: 'right',
            type: 'linear',
            min: 0,
            max: 0.08,
        },
    }
};