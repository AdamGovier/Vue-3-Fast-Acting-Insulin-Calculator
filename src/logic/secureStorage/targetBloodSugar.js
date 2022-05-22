
import validate from "./validate.js";
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(allowUndefined) {
        const targetBloodSugar = localStorage.getItem('app_target_blood_sugar');

        if(!validate("targetBloodSugar", targetBloodSugar, {
            withinRange: true,
            number: true,
            allowUndefined
        })) return utils.emitDataReset();

        return parseFloat(targetBloodSugar);
    },
    write(value) {
        if(!validate("targetBloodSugar", value, {
            withinRange: true,
            number: true,
            allowUndefined: false
        })) return false;
        
        localStorage.setItem(`app_target_blood_sugar`, value);
        return true;
    }
}

