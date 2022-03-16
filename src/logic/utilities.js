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