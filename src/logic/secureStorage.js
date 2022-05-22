// Safety Feature!

/**
 * Secure Storage aims to provide a safety net for saving and reading data by validating all data being saved and written to local storage.
 */
import app from "@/main";

import carbRatio from "./secureStorage/carbRatio.js";
import bloodSugarUnit from "./secureStorage/bloodSugarUnit.js";
import minMaxBlood from "./secureStorage/minMaxBlood.js";
import targetBloodSugar from "./secureStorage/targetBloodSugar.js";
import correctionFactor from "./secureStorage/correctionFactor.js";
import carbRatioScheduled from "./secureStorage/carbRatioScheduled.js";

export default {
    retrieve: {
        carbRatio: carbRatio.retrieve,
        bloodSugarUnit: bloodSugarUnit.retrieve,
        minBlood: (allowUndefined) => {
            return minMaxBlood.retrieve("min", allowUndefined);
        },
        maxBlood: (allowUndefined) => {
            return minMaxBlood.retrieve("max", allowUndefined);
        },
        targetBloodSugar: targetBloodSugar.retrieve,
        correctionFactor: correctionFactor.retrieve,
        carbRatioScheduled: carbRatioScheduled.retrieve
    },
    write: {
        carbRatio: carbRatio.write,
        bloodSugarUnit: bloodSugarUnit.write,
        minBlood: (value) => {
            return minMaxBlood.write("min", value);
        },
        maxBlood: (value) => {
            return minMaxBlood.write("max", value);
        },
        targetBloodSugar: targetBloodSugar.write,
        correctionFactor: correctionFactor.write,
        carbRatioScheduled: carbRatioScheduled.write
    }
}

export const utils = {
    /**
     * Check the value is within the range of the safety variables.
     * @param {*} Value, the value to compare.
     * @param String key, The property name in the $safety global object.
     */
    withinRange(value, key) {
        // if not in range.
        if(value <= app.config.globalProperties.$safety[key].min || value >= app.config.globalProperties.$safety[key].max) 
            return false;
        
        // Passes all checks.
        return true;
    },
    // If a major data miss match is present reset all the data. This HARD BLOCKS ANY CALCULATIONS WITH BAD DATA.
    // This will only be used if absolutely necessary.
    emitDataReset() {
        app.config.globalProperties.emitter.emit('emergency-reset');
    }

}