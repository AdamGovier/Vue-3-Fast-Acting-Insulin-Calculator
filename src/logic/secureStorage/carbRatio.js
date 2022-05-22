import validate from "./validate.js";
import {utils} from "../secureStorage";

const localStorage = window.localStorage;

export default {
    retrieve(allowUndefined) {
        const carbRatio = localStorage.getItem('app_carb_ratio');

        if(!validate("carbRatio", carbRatio, {
            withinRange: true,
            number: true,
            allowUndefined
        })) return utils.emitDataReset();

        return parseFloat(carbRatio);
    },
    write(value) {
        if(!validate("carbRatio", value, {
            withinRange: true,
            number: true,
            allowUndefined: false
        })) return false;

        localStorage.setItem('app_carb_ratio', value);
        return true;
    }
}

