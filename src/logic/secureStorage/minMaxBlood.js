
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(minMax, allowUndefined) {
        const rawValueForMinMaxBlood = localStorage.getItem(`app_${minMax}imum_blood_sugar`);

        // First setup does not expect a value.
        if(rawValueForMinMaxBlood === null && allowUndefined) return undefined;

        // Will work for checking if value is set too. as undefined is not a number.
        if(isNaN(rawValueForMinMaxBlood)) return utils.emitDataReset();
        if(!utils.withinRange(rawValueForMinMaxBlood, `${minMax}imumBloodSugar`)) return utils.emitDataReset();

        return parseFloat(rawValueForMinMaxBlood);
    },
    write(minMax, value) {
        if(isNaN(value)) return false;
        if(!utils.withinRange(value, `${minMax}imumBloodSugar`)) return false;

        localStorage.setItem(`app_${minMax}imum_blood_sugar`, value);
        return true;
    }
}

