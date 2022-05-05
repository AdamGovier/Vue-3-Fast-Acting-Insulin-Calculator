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

export function createTimedAverageGraph(times, values, min, max) {
    // Create labels from arrays of times provided ['12:00', '14:00', '16:00'] becomes ["12:00 - 1600", '14:00 - 16:00', '16:00 - 12:00']
    const labels = times.map(( time,i ) => {
        let next = "";

        if(times[i + 1]) {
            next = times[i + 1]
        } else {
            next = times[0];
        }

        return `${time} - ${next}`;
    });

    // Decide which colour the value needs.
    const colours = values.map(value => {
        if(value > max) {
            return "#FF8C00";
        } else if (value < min) {
            return '#8B0000';
        } else {
            return '#6B8E23';
        }
    });

    /* Effectivly a 3 dimensional array.
        [
            labels,
            values,
            colours
        ]
    */

    return {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: "",
                    backgroundColor: colours, 
                    data: values,
                    datalabels: {
                        color: 'white',
                        font: {
                            size: "25px",
                            weight: "600"
                        }
                    }
                }
            ]
        },
        options: {
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 0
                    }
                }
            }
        }
    }    
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