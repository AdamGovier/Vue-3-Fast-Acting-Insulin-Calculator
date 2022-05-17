import secureStorage from "./secureStorage";
import {load} from "./secureLoad";

/**
 * Returns the recomended doseage based on provided parameters.
 * @param Object values An object of values including the keys carbohydrates,bloodGlucose and modifiers.
 */
export function calculate(values) {
    let dose = 0; // Variable for keeping track of the total dose.

    if(values.carbohydrates) dose += carbs2Insulin(values.carbohydrates);
    if(values.bloodGlucose) dose += bloodSugarDoseCalc(values.bloodGlucose);
    if(values.modifiers.length) dose = handleModifiers(values.modifiers, dose);

    //round to nearest 0.25;
    dose = (Math.round(dose * 4) / 4).toFixed(2);

    return dose >= 0 ? dose : "0.00";
}

const handleModifiers = (modifiers, dose) => {
    let doseModificationTotal = 0;

    modifiers.forEach(modifier => {
        const doseChange = (dose / 100) * modifier.percentage;;
        modifier.addition ? doseModificationTotal += doseChange : doseModificationTotal -= doseChange;
    });

    return dose += doseModificationTotal;
}

/**
 * @description Converts an amount of carbohydrates to a dose.
 * @param {Number} carbohydrates  
 */
 const carbs2Insulin = (carbohydrates) => {
    /**
     * Checks if the numberOfCarbs provided is not of an extreme quantity.
     */

    // if(validate.numberOfCarbs(numberOfCarbs).error) {
    //     throwUserError(validate.numberOfCarbs(numberOfCarbs).reason);
    //     throw "Invalid Carbohydrate Entree";
    // }


    /**
     * Checks if the value "carbRatio" is stored within the app's local storage. Just incase of data corruption or something similar.
     */
    const carbRatio = secureStorage.retrieve.carbRatio();
    // checkValue(carbRatio, "carbRatio");

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
    const minimumBloodGlucoseBeforeDoseDecrease = secureStorage.retrieve.minBlood();
    const maximumBloodGlucoseBeforeDoseIncrease = secureStorage.retrieve.maxBlood();

    const targetBloodSugar = load('app_target_blood_sugar');
    const correctionFactor = load('app_correction_factor');

    if(bloodGlucose < minimumBloodGlucoseBeforeDoseDecrease || bloodGlucose > maximumBloodGlucoseBeforeDoseIncrease) {
        /**
         * Forumla sourced from https://www.nhstayside.scot.nhs.uk/OurServicesA-Z/DiabetesOutThereDOTTayside/PROD_263751/index.htm
         * (Current Blood Glucose Level - Target Blood Sugar) then divided by the correctionFactor.
        */
        return (bloodGlucose - targetBloodSugar) / correctionFactor;
    } else { // If bloods within range do not add a correction dose.
        return 0;
    }
}