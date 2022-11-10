export function getDDMMYY(timestamp) {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }

    return new Intl.DateTimeFormat('en-GB', options).format(new Date(timestamp));
}

export function getHHMM(dateObject) { // Returns a time string in the format hh:mm
    const hhmm = dateObject.toISOString().split('T')[1].split(":");
    return hhmm[0] + ":" + hhmm[1];
}

export function roundPointFive(num) {
    return Math.round(num*2)/2;
}   

/**
 * Compares two Temporal date objects and works out if they occur on the same date (dd/mm/yyyy).
 * @param {Object} date1 Temporal instance
 * @param {Object} date2 Temporal instance
 * @returns {Boolean} true if the date is the same otherwise false.
 */
export function isSameDate(date1, date2) {
    return (date1.day === date2.day && date1.month === date2.month && date1.year === date2.year)
}