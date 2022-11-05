import secureStorage from "./secureStorage";
import {currentCarbRatio} from "./scheduledCarbRatio";

/**
 * Returns the recomended doseage based on provided parameters.
 * @param Object values An object of values including the keys carbohydrates,bloodGlucose and modifiers, additionalUnits.
 */
export function calculate(values) {
    let dose = 0; // Variable for keeping track of the total dose.

    if(values.carbohydrates) dose += carbs2Insulin(values.carbohydrates);
    if(values.bloodGlucose) dose += bloodSugarDoseCalc(values.bloodGlucose);
    if(values.modifiers.length) dose = handleModifiers(values.modifiers, dose);

    // Manually add units. i.e. Sick Day Rules. (Not affected by modification settings).
    if(values.additionalUnits) dose += values.additionalUnits;


    //round to nearest 0.25;
    dose = (Math.round(dose * 4) / 4).toFixed(2);

    return dose >= 0 ? dose : "0.00";
}

/**
 * Allows modification settings to alter total dose.
 * @param {Array} modifiers An array of modifier objects.
 * @param {Number} dose The dose to provide calculations on.
 * @returns {Number} dose
 */
const handleModifiers = (modifiers, dose) => {
    let doseModificationTotal = 0;

    modifiers.forEach(modifier => {
        const doseChange = (dose / 100) * modifier.percentage;;

        // Add or deduct percentage from original dose.
        modifier.addition ? doseModificationTotal += doseChange : doseModificationTotal -= doseChange;
    });

    return dose += doseModificationTotal;
}

/**
 * @description Converts an amount of carbohydrates to a dose.
 * @param {Number} carbohydrates  
 */
 const carbs2Insulin = (carbohydrates) => {
    // Extreme quantities are now handled in runCalculations() in Calculator.vue.

    /**
     * Checks if the value "carbRatio" is stored within the app's local storage with the addition of safety checks, just incase of data corruption or something similar.
     */
    const carbRatio = currentCarbRatio();

    /**
     * https://www.nhstayside.scot.nhs.uk/OurServicesA-Z/DiabetesOutThereDOTTayside/PROD_263751/index.htm 
     * "
     *  Dose of bolus insulin (units)
     *      = Amount of CHO eaten (grams) divided by insulin to carbohydrate ratio (ICR)
     * "
     */
    return carbohydrates / carbRatio;
}


/**
 * @description Generates a dose based of the provided BG Level.
 * @param {Number} bloodSugar 
 */
const bloodSugarDoseCalc = (bloodGlucose) => {
    // These are very long variable names however I think it is important that they are clear on what they store.
    const highBloodGlucoseTolerance = secureStorage.retrieve.maxBlood();

    const targetBloodSugar = secureStorage.retrieve.targetBloodSugar();
    const correctionFactor = secureStorage.retrieve.correctionFactor();

    if(bloodGlucose > highBloodGlucoseTolerance) {
        /**
         * Forumla sourced from https://www.nhstayside.scot.nhs.uk/OurServicesA-Z/DiabetesOutThereDOTTayside/PROD_263751/index.htm
         * (Current Blood Glucose Level - Target Blood Sugar) then divided by the correctionFactor.
        */
        return (bloodGlucose - targetBloodSugar) / correctionFactor;
    } else { // If bloods are not of a high blood glucose level, do not add a correction dose.
        return 0;
    }
}