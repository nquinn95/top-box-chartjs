import { LightningElement, track,  } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';

import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import annotationPlugin from '@salesforce/resourceUrl/ChartJsAnnotation'
import ChartDataLabels from '@salesforce/resourceUrl/ChartJsDataLabel';


export default class HorizontalBarChart extends LightningElement {

@track isChartJsInitialized;
chart;



//rendered callback to render the charts
renderedCallback(){

    if(this.isChartJsInitialized) {
        return; 
    }

    this.isChartJsInitialized = true;

    Promise.all([
        console.log('beginning of promise'),
        loadScript(this, chartjs),
        loadScript(this, ChartDataLabels),
        loadScript(this, annotationPlugin),

    ]).then(() => {

        const ctx = this.template.querySelector('canvas.barChart').getContext('2d');

        this.chart= new window.Chart(ctx, {
            //line 38 is registering the plugins for chartjs
            plugins: [ChartDataLabels],
            type: 'bar',
            data: {
                labels: [
                    'Courtesy Top Box',
                    'Quality Top Box',
                    'Temp Top Box',
                    'Exp Top Box %',
                    'Exp Hosp Top Box'
                ],
                datasets: [ {
                data: [3.5, 3.5, 3.5, 4.0, 4.0],
                barThickness: 60,
                backgroundColor: [ '#FCC003', '#FCC003', '#FCC003', '#45C65A', '#45C65A' ],
                // datalabels: {
                //     color: '#FFCE56',
                //     anchor: 'center',
                //     align: 'center',
                // },

            },

            ],

            },
            options: {

                responsive: false,
                
                title: {
                    display: false,
                },
                indexAxis: 'y',
                elements: { bar: {
                    borderWidth: 1,
                }},

                scales: {
                    x: {
                        type: 'linear',
                        max: 5,
                        min: 0,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
 
                //plugin options for datalabels

                plugins: {
                    autocolors: false,
                    datalabels: {
                        color: '#FFCE56',
                        anchor: 'center',
                        align: 'center',
                        labels: {
                            value: {
                                color: 'white'

                            }
                        },
            
                    }
                },


            }
        });
        this.chart.canvas.parentNode.style.height = 'auto';
        this.chart.canvas.parentNode.style.width = '100%';

        // //manual window resizing
        // window.addEventListener('beforeprint', () => {
        //     this. chart.resize(600, 600);
        //    });
        window.addEventListener(
            "resize",
            this.handleWindowResize
        );


        console.log('Scripts loaded succesfully'); 

    }).catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading ChartJS',
                message: error.message,
                variant: 'error', 
            }),
        );
    });

}


handleWindowResize = () => {
    if (this.isChartJsInitialized === true) {
        this.chart.resize();
    }
}

}