import secureStorage from "./secureStorage";

export function rangeOverlapOthers(rangeObject, carbRatioArray) {
    const overlappingTimeFiltered = carbRatioArray.filter(ratioEntry => {
        const providedTimeRange = [convertTimeToNumber(rangeObject.timeStart), convertTimeToNumber(rangeObject.timeEnd)];
        const entryTimeRange = [convertTimeToNumber(ratioEntry.timeStart), convertTimeToNumber(ratioEntry.timeEnd)];

        // e.g. a: 13:00 b: 04:00. Then 04:00 is the next day so add 24 hour to correct the calculation.
        if(providedTimeRange[1] < providedTimeRange[0]) providedTimeRange[1] += 24;
        if(entryTimeRange[1] < entryTimeRange[0]) entryTimeRange[1] += 24;

        // b >= c && a <= d // https://stackoverflow.com/questions/36011227/javascript-check-if-time-ranges-overlap
        return(providedTimeRange[1] >= entryTimeRange[0] && providedTimeRange[0] <= entryTimeRange[1]);
    });

    return !!overlappingTimeFiltered.length;
}

export function currentCarbRatio() {
    const hoursMinsFormatted = Temporal.Now.plainTimeISO()._repr_.split("<")[1].split(":");
    const now = convertTimeToNumber(`${hoursMinsFormatted[0]}:${hoursMinsFormatted[1]}`);

    const overlappingTimeFiltered = secureStorage.retrieve.carbRatioScheduled().filter(ratioEntry => {
        const timeRangeStart = convertTimeToNumber(ratioEntry.timeStart),
        timeRangeEnd = convertTimeToNumber(ratioEntry.timeEnd);

        return (now >= timeRangeStart && now <= timeRangeEnd);
    });

    return overlappingTimeFiltered[0] ? parseFloat(overlappingTimeFiltered[0].carbRatio) : secureStorage.retrieve.carbRatio();
};

function convertTimeToNumber(time) {
    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]) / 60;
    return hours + minutes;
}