import validate from "./validate.js";
import {utils} from "../secureStorage";
import { v4 as uuidv4 } from 'uuid';
import {rangeOverlapOthers} from "../scheduledCarbRatio.js";

const localStorage = window.localStorage;

export default {
    retrieve() {
        return getAllCarbRatios();
    },
    add(value) {
        if(!validate("carbRatio", value.carbRatio, {
            withinRange: true,
            number: true,
            allowUndefined: false
        })) return {status: false, msg: "Invalid value provided.", target: "carbRatio"};

        if(!value.timeStart || !value.timeEnd) 
            return {status: false, msg: "Missing value(s).", target: "time"};

        let timeStart,timeEnd;

        // Valid Times
        try {
            timeStart = new Temporal.PlainTime.from(value.timeStart);
            timeEnd = new Temporal.PlainTime.from(value.timeEnd);
        } catch (error) {
            return {status: false, msg: "Invalid times provided.", target: "time"};
        }

        // timeStart must come after timeEnd.
        // if(Temporal.PlainTime.compare(timeStart,timeEnd) !== -1) 
        //     return {status: false, msg: "The end time provided does not occur after the first time provided.", target: "time"};

        let carbRatioArrayJSON = localStorage.getItem("app_scheduled_carb_ratio");
        if(!carbRatioArrayJSON) carbRatioArrayJSON = "[]"; // If empty, set it to an empty json array.

        let carbRatioArray;

        try {
            carbRatioArray = JSON.parse(carbRatioArrayJSON);
        } catch (error) {
            // Not valid JSON most likely due to corruption or bneing tampered with.
            utils.emitDataReset();

            // Not entirely needed.
            return {status: false, msg: "Fatal error in application storage.", target: "carbRatio"};;
        }

        if(rangeOverlapOthers(value, carbRatioArray)) return {status: false, msg: "The time range provided overlaps another scheduled carb ratio.", target: "time"}

        carbRatioArray.push({...value, uuidv4: uuidv4()});
        localStorage.setItem("app_scheduled_carb_ratio", JSON.stringify(carbRatioArray));

        return {status: true};
    },
    get(id) {
        const allEntries = getAllCarbRatios();
        return allEntries.filter(entry => entry.uuidv4 === id)[0];
    },
    delete(id) {
        const allEntries = getAllCarbRatios();
        const newArray = allEntries.filter(entry => entry.uuidv4 !== id);
        localStorage.setItem("app_scheduled_carb_ratio", JSON.stringify(newArray));
        return true;
    },
    reset() {
        localStorage.setItem("app_scheduled_carb_ratio", "[]");
    }
}

function getAllCarbRatios() {
    let carbRatioArrayJSON = localStorage.getItem("app_scheduled_carb_ratio");
    if(!carbRatioArrayJSON) carbRatioArrayJSON = "[]"; // If empty, set it to an empty json array.

    let carbRatioArray;

    try {
        carbRatioArray = JSON.parse(carbRatioArrayJSON);
    } catch (error) {
        // Not valid JSON most likely due to corruption or bneing tampered with.
        return utils.emitDataReset();
    }

    return carbRatioArray;
}