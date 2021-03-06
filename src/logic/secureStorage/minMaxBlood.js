import validate from "./validate.js";
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(minMax, allowUndefined) {
        const minMaxBlood = localStorage.getItem(`app_${minMax}imum_blood_sugar`);
        
        if(!validate(`${minMax}imumBloodSugar`, minMaxBlood, {
            withinRange: true,
            number: true,
            allowUndefined
        })) return utils.emitDataReset();

        return parseFloat(minMaxBlood);
    },
    write(minMax, value) {
        if(!validate(`${minMax}imumBloodSugar`, value, {
            withinRange: true,
            number: true,
            allowUndefined: false
        })) return false;

        localStorage.setItem(`app_${minMax}imum_blood_sugar`, value);
        return true;
    }
}

