export default class {
    constructor(error) {
        this.error = JSON.stringify(error, Object.getOwnPropertyNames(error));
        this.timestamp = Temporal.Now.instant().epochMilliseconds;
    }
}