
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(allowUndefined) {
        const rawValueForCarbRatio = localStorage.getItem('app_carb_ratio');

        // First setup does not expect a value.
        if(rawValueForCarbRatio === null && allowUndefined) return undefined;

        // Will work for checking if value is set too. as undefined is not a number.
        if(isNaN(rawValueForCarbRatio)) return utils.emitDataReset();
        if(!utils.withinRange(rawValueForCarbRatio, "carbRatio")) return utils.emitDataReset();

        return rawValueForCarbRatio;
    },
    write(value) {
        if(isNaN(value)) return false;
        if(!utils.withinRange(value, "carbRatio")) return false;

        localStorage.setItem('app_carb_ratio', value);
        return true;
    }
}

