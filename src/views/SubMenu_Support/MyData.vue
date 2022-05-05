<template>
    <section class="horizCentre">
        <PannelHeader>
            My Data
        </PannelHeader>

        <BtnSecondary @click="exportPDF();">
            Export Data
        </BtnSecondary>
    </section>
</template>

<script>
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
// import { FileOpener } from '@ionic-native/file-opener';
// import fileOpener2 from "cordova-plugin-file-opener2/www/plugins.FileOpener2";

import { Analytics, generateFakeDiary } from '../../logic/analytics';
import { renderGraphToImage, createRangeGraph, createTimedAverageGraph } from "../../logic/graphs";

import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';
import BtnSecondary from '../../components/Buttons/Secondary.vue';

export default {
    components: {
        PannelHeader,
        BtnSecondary
    },
    methods: {
        async exportPDF() {
            console.log("Attempting to export.");

            // If user has not used the calculator thus no data.
            if(!window.localStorage.getItem("app_diary")) return window.alert('No data available!');
            const diary = JSON.parse(window.localStorage.getItem("app_diary"));

            // Test Data // Comment out or remove in production.
            generateFakeDiary(100);

            // analytic data.

            const now = Temporal.Now.plainDateTimeISO();
            const startDate = now.subtract({days: 30}); // Last 30 days.

            const analytics = new Analytics(diary);

            const minBloodSugar = parseFloat(window.localStorage.getItem("app_minimum_blood_sugar"));
            const maxBloodSugar = parseFloat(window.localStorage.getItem("app_maximum_blood_sugar"));

            // get required analytics
            const past30DaysResult =
                analytics
                 .after(startDate)
                 .before(now)
                 .average("bloodGlucose", "mean")
                 .percentageRange({start:minBloodSugar, end:maxBloodSugar}, "bloodGlucose", "inTarget")
                 .percentageRange({start:maxBloodSugar + 0.1}, "bloodGlucose", "high")
                 .percentageRange({end:minBloodSugar - 0.1}, "bloodGlucose", "low")
                 .fourHourAvg();

            console.log(past30DaysResult);

            const doc = new jsPDF();

            // Branding & Title
            doc.addImage(require("../../assets/images/icons/logo.png"), "JPEG", 14, 10, 30, 30);

            doc.setFontSize(30);
            doc.setFont("Helvetica", "Bold");

            doc.text("Bolus Calculator", 53, 23);

            doc.setFontSize(20);
            doc.setFont("Helvetica", "");

            doc.text("Application Data", 53, 33);

            // 30 Day Average

            doc.setFont("Helvetica", "Bold");
            doc.setFontSize(15);
            doc.text("Previous 30 days.", 14, 61.5);
            
            doc.rect(14, 65, 180, 100, 'S')
            doc.addImage(require("../../assets/images/icons/fontAwesome/smile.png"), "JPEG", 90, 82.5, 30, 30);

            // Display Average

            doc.setTextColor(107,142,35);

            if(past30DaysResult.results.averages.mean.bloodGlucose > maxBloodSugar) doc.setTextColor(255,140,0);
            if(past30DaysResult.results.averages.mean.bloodGlucose < minBloodSugar) doc.setTextColor(139,0,0);

            doc.setFontSize(20);
            doc.text(`${past30DaysResult.results.averages.mean.bloodGlucose.toFixed(1)} mmol/L`, 87, 131.5);

            // Sub heading

            doc.setFontSize(18);
            doc.setTextColor(0,0,0);
            doc.setFont("Helvetica", "");

            doc.text("Average Blood Glucose Level", 62, 141.5);

            // rangeGraph

            const rangeGraph = renderGraphToImage(createRangeGraph(
                [`Higher than ${maxBloodSugar}`, `Within ${minBloodSugar} - ${maxBloodSugar}`, `Lower than ${minBloodSugar}`],
                [past30DaysResult.results.range.high.toFixed(1), past30DaysResult.results.range.inTarget.toFixed(1), past30DaysResult.results.range.low.toFixed(1)]
            ));

            doc.setFontSize(15);
            doc.setFont("Helvetica", "");
            doc.text("Time in Target.", 14, 176.5);

            doc.rect(14, 180, 180, 100, 'S')
            doc.addImage((rangeGraph), "PNG", 17.5, 185, 170, 90);

            doc.addPage();

            // timedAverageGraph

            doc.setFont("Helvetica", "");
            doc.text("Time based average glucose.", 14, 11.5);
            doc.rect(14, 15, 180, 100, 'S')

            const timedAverageGraph = renderGraphToImage(createTimedAverageGraph(
                ["0:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
                past30DaysResult.results.groups.bcFourHourAvg,
                minBloodSugar,
                maxBloodSugar
            ));

            doc.addImage((timedAverageGraph), "PNG", 20, 20, 170, 90);

            doc.setFont("Helvetica", "");
            doc.text("Raw data.", 14, 126.5);

            const body = past30DaysResult.diary.map(entry => {
                const dateTime = new Temporal.PlainDateTime.from(entry.timestamp);

                const modifiers = entry.modifiers.map(modifier => {
                    // e.g. Exercise: +15% 
                    return `${modifier.name}: ${modifier.addition ? "+" : "-"}${modifier.percentage}%`;
                }).join(", ");

                return [
                    dateTime.toLocaleString('en-gb', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    }), // e.g. 03 August 2022
                    `${dateTime.hour}:${('0' + dateTime.minute).slice(-2)}`, // HH:MM

                    entry.carbohydrates,
                    entry.bloodGlucose || "N/A",
                    entry.units,

                    modifiers || "N/A",
                    `1:${entry.ratio}`
                ];
            });

            // Raw Data
            autoTable(doc, {
                head: [['Date', 'Time', 'Carbohydrates', 'Blood Glucose', 'Units', 'Modifiers', 'Ratio']],
                body,
                headStyles: {
                    fillColor: '#ef4d5a'
                },
                startY: 130
            })

            doc.save();
            return;

            const fileData = doc.output("datauristring");
            const date = Temporal.Now.plainDateISO().toLocaleString('en-gb', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            const filename = `Bolus-Calc-${date}.pdf`;

            await Filesystem.writeFile({
                path: filename,
                data: fileData,
                directory: Directory.Documents,
            });

            const uriResult = await Filesystem.getUri({
                directory: Directory.Documents,
                path: filename
            });

            const path = uriResult.uri;
            
            // Not an ideal solution, but works for now. // https://stackoverflow.com/questions/67943445/capacitor-3-and-vuejs-open-saved-file-or-download?newreg=e131f0a8e4b94d3abb69fa01ea38642c
            await Share.share({
                title: filename,
                text: 'PDF containing data from Bolus Calculator',
                url: path,
                dialogTitle: 'Export PDF',
            });
        }
    }
}
</script>

