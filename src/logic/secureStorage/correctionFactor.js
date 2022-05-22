import validate from "./validate.js";
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(allowUndefined) {
        const correctionFactor = localStorage.getItem('app_correction_factor');

        if(!validate("correctionFactor", correctionFactor, {
            withinRange: true,
            number: true,
            allowUndefined
        })) return utils.emitDataReset();

        return parseFloat(correctionFactor);
    },
    write(value) {
        if(!validate("correctionFactor", value, {
            withinRange: true,
            number: true,
            allowUndefined: false
        })) return false;
        
        localStorage.setItem(`app_correction_factor`, value);
        return true;
    }
}

