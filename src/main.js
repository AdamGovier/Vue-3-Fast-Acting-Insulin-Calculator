import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import mitt from 'mitt'; // https://stackoverflow.com/questions/63471824/vue-js-3-event-bus

// Camera PWA Elements
// import { defineCustomElements } from '@ionic/pwa-elements/loader';
// defineCustomElements(app.config.globalProperties.window);

// "Provides standard objects and functions for working with dates and times." Stage 3 TC39. Just testing how I will implement the new system in the future.
import { Temporal } from '@js-temporal/polyfill';
window.Temporal = Temporal;

const emitter = mitt();

const app = createApp(App);

// If you plan to use this project please credit me, thank you!
app.config.globalProperties.$author = "Adam Govier";
app.config.globalProperties.$authorLink = "https://adamgovier.co.uk";

app.config.globalProperties.$tos_version = "1.9";
app.config.globalProperties.$build_no = "3.2.9";

app.config.globalProperties.$endpoint = "http://5.71.44.248:27015/"

// Safety constraints.

/* 
    The safety constraints provided are not necessarily going to prevent every mistake 
    but it should lower the chance of miss inputs of large proportion.

    All blood sugar related values should be in mmol/L (mg/dL divided by 18).

    Would love a medical professional to look over these settings as these settings come from my experience as a diabetic and various sources online.
*/

app.config.globalProperties.$safety = {

    dailyBolusIntake: {
        min: 0,
        max: 200
    },

    dailyBasalIntake: {
        min: 0,
        max: 100
    },

    carbRatio: {
        min: 0, // If it is lower than zero you don't take insulin? or you take infinite insulin? so this is self explanatory.
        max: 51 // If someone has a higher ratio than this I was be shocked! // Mine is 1:8 :D
    },

    // Wasn't to sure what to set the boundaries for this one. The minimum is greater than zero as the correction factor must be used also to stop the posibility of values being multiplied by zero later on in the calculation.
    correctionFactor: {
        min: 0, 
        max: 25
    },
    
    minimumBloodSugar: {
        min: 3,
        max: 7
    },

    maximumBloodSugar: {
        min: 5.9,
        max: 13.1
    },

    targetBloodSugar: {
        min: 3,
        max: 9.1
    },

    carbohydratesGuidance: { // show warning on the calculator if user enters more carbs than this.
        max: 200
    }
}
// End of safety constraints.

app.config.globalProperties.emitter = emitter;

app.use(router).mount('#app');

export default app; // Access globalProperties from external modules. e.g. ./src/logic/secureLoad.js
