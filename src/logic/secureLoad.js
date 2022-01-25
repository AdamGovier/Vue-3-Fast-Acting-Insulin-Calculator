// Safety Feature!

import app from "@/main";
const storage = window.localStorage;

/*
    The idea is that retrieving values through this method will validate the output further lowering the chance of falty data due to data corruption.
*/
export function load(key) {
    switch (key) {
        case "app_carb_ratio":
            validateCarbRatio();
            break;
        case "app_minimum_blood_sugar":
            validateMinimumBloodSugar();
            break;
        case "app_maximum_blood_sugar":
            validateMaximumBloodSugar();
            break;
        case "app_target_blood_sugar":
            validateTargetBloodSugar();
            break;
        case "app_correction_factor":
            validateCorrectionFactor();
            break;
    }

    return storage.getItem(key);
}

function validateCarbRatio() {
    const carbRatio = storage.getItem("app_carb_ratio");

    exists(carbRatio);
    isNumber(carbRatio);
    withinRange(carbRatio, "carbRatio");
}


function validateMinimumBloodSugar() {
    const minimumBloodSugar = storage.getItem("app_minimum_blood_sugar");

    exists(minimumBloodSugar);
    isNumber(minimumBloodSugar);
    withinRange(minimumBloodSugar, "minimumBloodSugar");
}

function validateMaximumBloodSugar() {
    const maximumBloodSugar = storage.getItem("app_maximum_blood_sugar");

    exists(maximumBloodSugar);
    isNumber(maximumBloodSugar);
    withinRange(maximumBloodSugar, "maximumBloodSugar");
}

function validateTargetBloodSugar() {
    const targetBloodSugar = storage.getItem("app_target_blood_sugar");

    exists(targetBloodSugar);
    isNumber(targetBloodSugar);
    withinRange(targetBloodSugar, "targetBloodSugar");
}

function validateCorrectionFactor() {
    const correctionFactor = storage.getItem("app_correction_factor");

    exists(correctionFactor);
    isNumber(correctionFactor);
    withinRange(correctionFactor, "correctionFactor");
}

// If a major data miss match is present reset all the data. This HARD BLOCKS ANY CALCULATIONS WITH BAD DATA.
// This will only be used if absolutely necessary.
function emitDataReset() {
    app.config.globalProperties.emitter.emit('emergency-reset');
}

function exists(value) {
    if(!value) emitDataReset();
}

function isNumber(value) {
    if(isNaN(value)) emitDataReset();
}

/**
 * Check the value is within the range of the safety variables.
 * @param {*} key The name in the $safety global variable.
 */
function withinRange(value, key) {
    if(value <= app.config.globalProperties.$safety[key].min || value >= app.config.globalProperties.$safety[key].max) {
        emitDataReset()
    }
}