import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';
  
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);

import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

export function renderGraphToImage(graphData) {
    const container = document.createElement('div');
    container.style.width = "500px";
    container.style.height = "160px";

    const canvas = window.document.createElement("canvas");
    canvas.id = "tempCanvas";

    container.appendChild(canvas);
    document.body.appendChild(container);

    new Chart(canvas.getContext('2d'), graphData);

    const base64 = canvas.toDataURL("image/png", 1.0);
    container.remove();
    return base64;
}

export function createRangeGraph(rangeKeys, values) {
    return {
        type: 'bar',
        data: {
            labels: rangeKeys,
            datasets: [{
                label: "",
                data: values,
                backgroundColor: ["#FF8C00", "#6B8E23", "#8B0000"], 
            }],
        },
        options: {
            animation: {
                duration: 0
            },
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: "15px"
                        },
                        padding: 20
                    },
                    grid: {
                        display: false
                    }
                }
            },
            indexAxis: 'y',
            plugins: {  // 'legend' now within object 'plugins {}'
                legend: {
                    labels: {
                        boxWidth: 0
                    }
                },
                datalabels: {
                    color: "white",
                    font: {
                        size: 15
                    },
                    formatter: val => val + '%'
                }
            },
        }
    }
}