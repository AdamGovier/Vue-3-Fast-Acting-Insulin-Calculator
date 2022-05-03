// Subsidiary of diary.

// Fluent Interface

import averages from "./analytics/averages.js";


/**
 * @description This is the Bolus Calculator Analytics API. Documentation is coming soon.
 */
export class Analytics {
    /**
     * @param Array diary An array of bolus calculator diary entry objects. 
     */
    constructor(diary) {
        this.diary = diary;
        this.results = {
            averages:{
                mean:{},
                median:{},
                mode: {}
            }
        };
    }

    /**
     * Include diary entries after a certain date.
     * @param Object dateTime, Temporal PlainDateTime object.
     */
    after(dateTime) {
        this.diary = filterDate(this.diary, -1, dateTime);
        return this;
    }

    /**
     * Include diary entries before a certain date.
     * @param Object dateTime, Temporal PlainDateTime object.
     */
    before(dateTime) {
        this.diary = filterDate(this.diary, 1, dateTime);
        return this;
    }
    

    /**
     * Gets required average 
     * @param String property, the property inside the diary entry object to get an average of.
     * @param String type, "mean" or "median" or "mode"
     * @example average("bloodGlucose", 'mean'); 
     */
    average(property, type) {
        if(isNaN(this.diary[0][property])) throw new Error("Average requires numeric values.");

        switch (type) {
            case "mean":
                this.results.averages.mean[property] = averages.getMean(this.diary, property);
                break;
            case "median":
                this.results.averages.median[property] = averages.getMedian(this.diary, property);
                break;
            case "mode":
                this.results.averages.mode[property] = averages.getMode(this.diary, property);
                break;
            default:
                throw new Error("Incompatible average type.");
        }

        return this;
    }
}

// Library

/**
 * Compares if object entry is before/after a provided date and returns a new filtered array.
 * @param Array diary An array of bolus calculator diary entry objects. 
 * @param Number check, -1 before || 1 after
 * @param Object comparison, Temporal PlainDateTime object.
 * @returns Array diary An array of bolus calculator diary entry objects. 
 */
function filterDate(diary, check, comparison) {
    return diary.filter(entry => {
        const entryDate = new Temporal.PlainDateTime.from(entry.timestamp);
        if(Temporal.PlainDateTime.compare(comparison, entryDate) === check) {
            return entry;
        }
    });
}

/**
 * For testing purposes only. Create a simulated bolus calculator diary.
 * @param Number size number of entries.
 */
export function generateFakeDiary(size) {
    let diaryEntries = [];
    simulateDiaryEntry();

    // sort by date.
    diaryEntries.sort((a,b) => {
        const timestampA = new Temporal.PlainDateTime.from(a.timestamp);
        const timestampB = new Temporal.PlainDateTime.from(b.timestamp);

        return Temporal.PlainDateTime.compare(timestampB, timestampA);
    });

    // Set results
    window.localStorage.setItem('app_diary', JSON.stringify(diaryEntries));

    /**
     * @description Generates a mock diary entry.
     */
    function simulateDiaryEntry(current) {
        if(!current) current = 0;
        const carbohydrates = Math.floor(Math.random() * 100);
        const bloodGlucose = ((Math.random() * 10) + 3).toFixed(1);
        const ratio = window.localStorage.getItem("app_carb_ratio");
        const units = (carbohydrates / ratio).toFixed(0);
        const timestamp = `2022-${('0' +((Math.random() * 11) + 1).toFixed(0)).slice(-2)}-${('0' +((Math.random() * 27) + 1).toFixed(0)).slice(-2)}T${('0' +((Math.random() * 22) + 1).toFixed(0)).slice(-2)}:${('0' +((Math.random() * 58) + 1).toFixed(0)).slice(-2)}`;

        diaryEntries.push({
            carbohydrates,
            bloodGlucose,
            units,
            ratio,
            timestamp,
            modifiers: []
        });

        current++;
        if(current < size) {
            simulateDiaryEntry(current);
        }
    }
}

