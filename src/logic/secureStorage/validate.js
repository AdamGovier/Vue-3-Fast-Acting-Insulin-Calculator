import app from "@/main";

export default function validate(property, value, options) {
    let status = true;

    if(options.withinRange && !withinRange(value, property)) status = false;
    if(options.number && isNaN(value)) status = false; 

    // If the value is undefined set the status to true.
    if(options.allowUndefined && (value === undefined || value === null)) status = true;
    return status;
}

function withinRange(value, key) {
    // if not in range.
    if(value <= app.config.globalProperties.$safety[key].min || value >= app.config.globalProperties.$safety[key].max)
        return false;
    
    // Passes all checks.
    return true;
}