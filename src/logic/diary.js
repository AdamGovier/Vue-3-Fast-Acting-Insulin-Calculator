const storage = window.localStorage;

import { getDDMMYY } from './utilities';

/**
 * Adds an entry to the diary. You might wonder why I am storing the whole modifier instead of just the ID but this is beacuse if the user deleted or changes a modifier the diary will inaccurately show the modifier for that entry.
 * @param Object entry An object including the following properties: bloodGlucose, carbohydrates and modifiers.
 */
export function addEntry(entry) {
    let diary = []; // diary entries array.
    if(storage.getItem("app_diary")) diary = JSON.parse(storage.getItem("app_diary")); // If diary values exist assign them.

    entry.timestamp = new Date();

    diary.push(entry);
    
    storage.setItem("app_diary", JSON.stringify(diary));
}

/**
 * Get diary entries for a paticular date "dd/mm/yy"
 * @param String date "dd/mmy/yy" 
 */
export function getDiaryEntries(date) {
    const storage = window.localStorage;
    
    if(!storage.getItem("app_diary")) return [];

    const entries = JSON.parse(storage.getItem("app_diary"));
    return entries.filter(entry => getDDMMYY(entry.timestamp) === date); // if date matches entry date.
}