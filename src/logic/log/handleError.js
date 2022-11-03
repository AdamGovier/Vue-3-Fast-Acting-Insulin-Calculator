import Report from "./Report";
import yesno from "yesno-dialog";

export default async function handleError(message, error) {
    const report = new Report(error);

    console.log(error);

    window.alert(message);

    saveReport(report);

    const shareBugReport = await yesno({
        bodyText: `Would you like to submit a bug report?`,
        labelYes: "Yes",
        labelNo: "No"
    });

    if(shareBugReport) {
        // TODO: make an API route to submit bug reports.
    }
}

function saveReport(report) {
    console.log(report);
    let reports = [];

    const rawReports = window.localStorage.getItem("app_bug_reports");
    if(rawReports) reports = JSON.parse(rawReports);

    reports.push(report);

    window.localStorage.setItem("app_bug_reports", JSON.stringify(reports));
}