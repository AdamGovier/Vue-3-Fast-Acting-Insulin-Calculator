import app from "@/main";
import secureStorage from "../secureStorage";

export default function validate(property, value, options) {
    let status = true;

    if(options.withinRange && !withinRange(value, property)) status = false;
    if(options.number && isNaN(value)) status = false; 

    // If the value is undefined set the status to true.
    if(options.allowUndefined && (value === undefined || value === null)) status = true;

    return status;
}

function withinRange(value, key) {
    const bloodSystem = secureStorage.retrieve.bloodSugarUnit(true);

    const rawMin = app.config.globalProperties.$safety[key].min;
    const rawMax = app.config.globalProperties.$safety[key].max;

    const min = bloodSystem === "mg/dL" ?  rawMin * 18 : rawMin;
    const max = bloodSystem === "mg/dL" ?  rawMax * 18 : rawMax;

    // if not in range.
    if(value <= min || value >= max)
        return false;
    
    // Passes all checks.
    return true;
}