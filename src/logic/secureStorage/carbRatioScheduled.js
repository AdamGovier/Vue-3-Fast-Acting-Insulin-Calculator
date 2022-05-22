import validate from "./validate.js";
import {utils} from "../secureStorage";
import { v4 as uuidv4 } from 'uuid';

const localStorage = window.localStorage;

export default {
    retrieve(allowUndefined) {

    },
    write(value) {
        console.log(value);
        if(!validate("carbRatio", value.carbRatio, {
            withinRange: true,
            number: true,
            allowUndefined: false
        })) return false;

        if(!value.timeStart || !value.timeEnd) return false;

        let carbRatioArrayJSON = localStorage.getItem("app_scheduled_carb_ratio");
        if(!carbRatioArrayJSON) carbRatioArrayJSON = "[]"; // If empty, set it to an empty json array.

        let carbRatioArray;

        try {
            carbRatioArray = JSON.parse(carbRatioArrayJSON);
        } catch (error) {
            // Not valid JSON most likely due to corruption or bneing tampered with.
            utils.emitDataReset();
            return false;
        }

        carbRatioArray.push({...value, uuidv4: uuidv4()});
        localStorage.setItem("app_scheduled_carb_ratio", JSON.stringify(carbRatioArray));

        return true;
    }
}

