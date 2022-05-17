//app_blood_sugar_unit
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(allowUndefined) {
        const rawBloodSugarUnit = localStorage.getItem('app_blood_sugar_unit');

        if(rawBloodSugarUnit === null && allowUndefined) return undefined;
        if(rawBloodSugarUnit !== "mmol/L" && rawBloodSugarUnit !== "mg/dL") return utils.emitDataReset();

        return rawBloodSugarUnit;
    },
    write(value) {
        console.log(value);
        if(value !== "mmol/L" && value !== "mg/dL") return false;

        localStorage.setItem('app_blood_sugar_unit', value);
        return true;
    }
}

