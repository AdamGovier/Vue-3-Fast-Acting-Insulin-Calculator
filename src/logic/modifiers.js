import { getHHMM } from './utilities';

export function getModifiers() {
    if(!window.localStorage.getItem('app_modifiers_json')) return []; // If not in storage return empty array.

    let modifiers = JSON.parse(window.localStorage.getItem('app_modifiers_json'));

    modifiers = modifiers.map(modifier => { 
        if(modifier.scheduler) { // Add hh:mm values, mostly for rendering purposes.
            modifier.scheduler.timeStart_hhmm = getHHMM(new Date(modifier.scheduler.timeStart));
            modifier.scheduler.timeEnd_hhmm = getHHMM(new Date(modifier.scheduler.timeEnd));
        }

        modifier.today = isModifierToday(modifier); // Check if the modifier is scheduled for today.
        modifier.checked = isModifierScheduledNow(modifier) && isModifierToday(modifier); // If modifier is scheduled now, make it checked (Selected).

        return modifier;
    });

    return modifiers;
}

function isModifierToday(modifier) {
    if(!modifier.scheduler) return false;

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const today = days[new Date().getDay()];

    return modifier.scheduler[today]; // Check if the scheduler value for that day is true.
}

function isModifierScheduledNow(modifier) {
    if(!modifier.scheduler) return false;

    // https://stackoverflow.com/questions/29785294/check-if-current-time-is-between-two-given-times-in-javascript

    let startDate = new Date();
    const start_hhmm = modifier.scheduler.timeStart_hhmm.split(':');

    startDate.setHours(start_hhmm[0]);
    startDate.setMinutes(start_hhmm[1]);
    startDate.setSeconds("00");

    let endDate = new Date();
    const end_hhmm = modifier.scheduler.timeEnd_hhmm.split(':');

    endDate.setHours(end_hhmm[0]);
    endDate.setMinutes(end_hhmm[1]);
    endDate.setSeconds("00");

    const currentDate = new Date();

    return (startDate < currentDate && endDate > currentDate);
}