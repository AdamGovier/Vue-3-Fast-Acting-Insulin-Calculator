import {isSameDate} from "./utilities";

const storage = window.localStorage;

/**
 * Adds an entry to the diary. You might wonder why I am storing the whole modifier instead of just the ID but this is beacuse if the user deleted or changes a modifier the diary will inaccurately show the modifier for that entry.
 * @param Object entry An object including the following properties: bloodGlucose, carbohydrates and modifiers.
 */
export function addEntry(entry) {
    let diary = []; // diary entries array.
    if(storage.getItem("app_diary")) diary = JSON.parse(storage.getItem("app_diary")); // If diary values exist assign them.

    entry.timestamp = Temporal.Now.plainDateTimeISO().toString();

    diary.push(entry);
    
    storage.setItem("app_diary", JSON.stringify(diary));
}

/**
 * Get diary entries for a paticular date "dd/mm/yy"
 * @param Object Temporal Date Object. 
 */
export function getDiaryEntries(queryDate) {
    const storage = window.localStorage;
    
    if(!storage.getItem("app_diary")) return [];

    // Get entries from LocalStorage
    const entries = JSON.parse(storage.getItem("app_diary"));

    return entries.filter(
        entry => {
            // Create date object from entry
            const entryDate = new Temporal.PlainDateTime.from(entry.timestamp); 

            // if entryDate is the same as queryDate in terms of dd/mm/yyyy.
            if(isSameDate(queryDate, entryDate)) return entry;
        }
    );
}
