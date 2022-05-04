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
import { renderGraphToImage, createRangeGraph } from "../../logic/graphs";

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
            // generateFakeDiary(100);

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
                 .percentageRange({start:minBloodSugar, end:maxBloodSugar}, "bloodGlucose", "inTarget")
                 .percentageRange({start:maxBloodSugar + 0.1}, "bloodGlucose", "high")
                 .percentageRange({end:minBloodSugar - 0.1}, "bloodGlucose", "low");


            console.log(past30DaysResult);
            // console.log(JSON.stringify(past30DaysResult.diary));

            const doc = new jsPDF();

            // Branding & Title
            doc.setFontSize(30);
            doc.text("Bolus Calculator", 55, 23);
            doc.setFontSize(20);
            doc.text("Application Data", 55, 33);
            doc.addImage(this.$pdf.logo.data, "JPEG", 15, 10, 30, 30);

            const rangeGraph = renderGraphToImage(createRangeGraph(
                [`Higher than ${maxBloodSugar}`, `Within ${minBloodSugar} - ${maxBloodSugar}`, `Lower than ${minBloodSugar}`],
                [past30DaysResult.results.range.high.toFixed(1), past30DaysResult.results.range.inTarget.toFixed(1), past30DaysResult.results.range.low.toFixed(1)]
            ));

            doc.addImage((rangeGraph), "PNG", 20, 50, 150, 80);

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
                startY: 150
            })

            // doc.save();
            // return;

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

