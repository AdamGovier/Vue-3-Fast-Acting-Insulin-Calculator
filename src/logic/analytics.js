// Subsidiary of diary.

// Fluent Interface

import averages from "./analytics/averages.js";
import standardDeviation from "just-standard-deviation";

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
            },
            groups:{

            },
            sDeviation: {

            },
            range: {
                
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
    
    sDeviation(property) {
        const sdArray = this.diary.map(entry => parseFloat(entry[property]));
        this.results.sDeviation[property] = standardDeviation(sdArray);  
        
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

    // Underworks, documentation soon when have full solution.
    // Ideally will become timesplitAverage(6); for example will split day into 6 parts and work out 6 averages.
    fourHourAvg() {
        this.createGroupByDate("bcFourHourAvg", "hour")

        const hours = this.results.groups.bcFourHourAvg;

        // Poor solution will come back to later.
        const divisons = [
            [...hours[0] || [], ...hours[1] || [], ...hours[2] || [], ...hours[3] || []],
            [...hours[4] || [], ...hours[5] || [], ...hours[6] || [], ...hours[7] || []],
            [...hours[8] || [], ...hours[9] || [], ...hours[10] || [], ...hours[11] || []],
            [...hours[12] || [], ...hours[13] || [], ...hours[14] || [], ...hours[15] || []],
            [...hours[16] || [], ...hours[17] || [], ...hours[18] || [], ...hours[19] || []],
            [...hours[20] || [], ...hours[21] || [], ...hours[22] || [], ...hours[23] || []],
        ];

        const property = "bloodGlucose";

        // 🤮 underworks temp solution!
        const avgs = [
            averages.getMean(divisons[0], property).toFixed(1),
            averages.getMean(divisons[1], property).toFixed(1),
            averages.getMean(divisons[2], property).toFixed(1),
            averages.getMean(divisons[3], property).toFixed(1),
            averages.getMean(divisons[4], property).toFixed(1),
            averages.getMean(divisons[5], property).toFixed(1)
        ]

        this.results.groups.bcFourHourAvg = avgs;

        return this;
    }

    /**
     * @description returns a percentage of which the values of property fall within range. accessed from ```results.range[name]```
     * @param Object range, object contain a start of range and end of range. the range is inclusive so for example 4.5 & 10.0 would be included. ```e.g. [{start:4.5, end:10.0}]```
     * @param String property, the name of the property to find percentage range of.
     * @param String name, a key which you can use to access the result. ```results.range[name]```
     */
    percentageRange(range, property, name) {
        let tracking = {inRange: 0, outOfRange: 0};

        this.diary.forEach(entry => {
            if(isNaN(entry[property])) 
                throw new Error("Invalid data inside of diary, Or invalid range property.");

            if(!entry[property]) return; // If entry property is blank.

            // if one range value is left unspecified just validate as true
            if((range.start ? entry[property] >= range.start : true) && (range.end ? entry[property] <= range.end : true)) {
                tracking.inRange++;
            } else {
                tracking.outOfRange++;
            }
        });

        // Simple percentage calculation. score / total * 100
        this.results.range[name] = tracking.inRange / (tracking.inRange + tracking.outOfRange) * 100;
        return this;
    }

    /**
     * @description creates an object containing multiple keys of a property value which then contain a sub array of diary entries. 
     * @param String name, the name of the group. ```results.groups[name]```
     * @param String property, the property to group by. ```e.g. bloodGlucose```
     */
    createGroup(name, property) {
        let groups = {};

        this.diary.forEach(entry => {
            if(!groups[entry[property]]) groups[entry[property]] = []; // if key does not exist init a blank array as value of key.
            groups[entry[property]].push(entry); // push to group
        });

        this.results.groups[name] = groups;
        return this;
    }

    /**
     * @description creates an object containing multiple keys of a date which then contain a sub array of diary entries. grouped by date.
     * @param String name, the name of the group. ```results.groups[name]```
     * @param String format, the format to group by: allowed values are: ```hour``` or ```day``` or ```day-of-week``` or ```week``` or ```month``` or ```dd-mm-yyyy```.
     */
    createGroupByDate(name, format) {

        // https://stackoverflow.com/questions/54130283/single-loop-containing-multiple-if-statements-or-multiple-if-statements-with-loo
        
        switch (format) {
            case "hour":
                this.results.groups[name] = groupByDate(this.diary, returnHourKey);
                break;

            case "day":
                this.results.groups[name] = groupByDate(this.diary, returnDayKey);
                break;
    
            case "day-of-week":
                this.results.groups[name] = groupByDate(this.diary, returnDayOfWeekKey);
                break;

            case "week":
                this.results.groups[name] = groupByDate(this.diary, returnWeekKey);
                break;

            case "month":
                this.results.groups[name] = groupByDate(this.diary, returnMonthKey);
                break;

            case "dd-mm-yyyy":
                this.results.groups[name] = groupByDate(this.diary, returnFullDateKey);
                break;

            default:
                throw new Error("Incompatible date format.");
        }

        return this;

        function groupByDate(diary, keyMethod) {
            let groups = {};

            diary.forEach(entry => {
                const entryDate = new Temporal.PlainDateTime.from(entry.timestamp);
                
                const key = keyMethod(entryDate); // Get key with suplied method from the paramater. e.g. returnDayKey => 13

                if(!groups[key]) groups[key] = []; // if key does not exist init a blank array as value of key.
                groups[key].push(entry); // push to group
            });
        
            return groups;
        }

        function returnDayKey(entryDate) {
            return entryDate.day;
        }

        function returnHourKey(entryDate) {
            return entryDate.hour;
        }

        function returnDayOfWeekKey(entryDate) {
            return entryDate.dayOfWeek;
        }

        function returnWeekKey(entryDate) {
            return entryDate.weekOfYear;
        }

        function returnMonthKey(entryDate) {
            return entryDate.month;
        }

        function returnFullDateKey(entryDate) {
            return `${('0' + entryDate.day).slice(-2)}-${('0' + entryDate.month).slice(-2)}-${entryDate.year}`;
        }
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

