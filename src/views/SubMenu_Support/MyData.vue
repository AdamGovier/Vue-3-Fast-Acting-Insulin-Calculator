<template>
    <section class="horizCentre">
        <PannelHeader>
            My Data
        </PannelHeader>

        <BtnSecondary @click="exportPDF();">
            <div style="width: 100%; display: flex; justify-content: space-around; align-items: center;">
                <p>Create Report</p>
                <div>
                    <p v-if="!showLoader">(PDF)</p>
                    <Loader v-if="showLoader" />
                </div>
            </div>
        </BtnSecondary>

        <BtnSecondary @click="saveJSON();">
            <div style="width: 100%; display: flex; justify-content: space-around; align-items: center;">
                <p style="margin: 10px;">Export Raw</p>
                <div>
                    <p style="margin: 10px;" v-if="!jsonLoader">(JSON)</p>
                    <Loader v-if="jsonLoader" />
                </div>
            </div>
        </BtnSecondary>
    </section>
</template>

<style scoped>
    .loader {
        margin: 0;
        height: 30px;
        width: 30px;
    }
</style>

<script>
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
// import { FileOpener } from '@ionic-native/file-opener';
// import fileOpener2 from "cordova-plugin-file-opener2/www/plugins.FileOpener2";

import { Analytics, generateFakeDiary } from '../../logic/analytics';
import { renderGraphToImage, createRangeGraph, createTimedAverageGraph } from "../../logic/graphs";

import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';
import BtnSecondary from '../../components/Buttons/Secondary.vue';
import Loader from "../../components/Other/Loader.vue";
import OptionsLabel from "../../components/Options/OptionLabel.vue";

export default {
    components: {
        PannelHeader,
        BtnSecondary,
        Loader,
        OptionsLabel
    },
    data() {
        return {
            showLoader: false,
            jsonLoader: false
        }
    },
    methods: {
        async exportPDF() {
            this.showLoader = true;

            // If user has not used the calculator thus no data.
            if(!window.localStorage.getItem("app_diary")) return window.alert('No data available!');
            const diary = JSON.parse(window.localStorage.getItem("app_diary"));

            // Create PDF doc
            const doc = new jsPDF();

            // Test Data // Comment out or remove in production.
            // generateFakeDiary(100);

            // Branding & Title
            doc.addImage(require("../../assets/images/icons/logo.png"), "JPEG", 14, 10, 30, 30);

            doc.setFontSize(30);
            doc.setFont("Helvetica", "Bold");

            doc.text("Bolus Calculator", 53, 23);

            doc.setFontSize(20);
            doc.setFont("Helvetica", "");

            doc.text("Application Data", 53, 33);


            // analytic data.

            const now = Temporal.Now.plainDateTimeISO();
            const sevenDaysPrior = now.subtract({days: 7}); // Last 30 days.
            const thirtyDaysPrior = now.subtract({days: 30}); // Last 30 days.

            // last 30 days.
            this.generateReportBlock("Previous 7 days.", doc, diary, sevenDaysPrior, now, 61.5);

            doc.addPage();

            // last 30 days.
            this.generateReportBlock("Previous 30 days.", doc, diary, thirtyDaysPrior, now, 15);

            doc.addPage();

            // All time.
            this.generateReportBlock("All time.", doc, diary, null, now, 15);

            doc.save();
            // await this.savePDF(doc);
        },

        async savePDF(doc) {
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

            this.showLoader = false;
            
            // Not an ideal solution, but works for now. // https://stackoverflow.com/questions/67943445/capacitor-3-and-vuejs-open-saved-file-or-download?newreg=e131f0a8e4b94d3abb69fa01ea38642c
            await Share.share({
                title: filename,
                text: 'PDF containing data from Bolus Calculator',
                url: path,
                dialogTitle: 'Export PDF',
            });
        },

        async saveJSON() {
            this.jsonLoader = true;
            const storage = window.localStorage;

            const data = JSON.stringify({
                config: {
                    app_correction_factor: storage.getItem("app_correction_factor"),
                    app_maximum_blood_sugar: storage.getItem("app_maximum_blood_sugar"),
                    app_carb_ratio: storage.getItem("app_carb_ratio"),
                    app_blood_sugar_unit: storage.getItem("app_blood_sugar_unit"),
                    app_minimum_blood_sugar: storage.getItem("app_minimum_blood_sugar"),
                    app_target_blood_sugar: storage.getItem("app_target_blood_sugar")
                },
                data: {
                    app_diary: storage.getItem("app_diary") ? JSON.parse(storage.getItem("app_diary")): [],
                    app_modifiers: storage.getItem("app_modifiers_json") ? JSON.parse(storage.getItem("app_modifiers_json")) : []
                }
            });

            const date = Temporal.Now.plainDateISO().toLocaleString('en-gb', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            const filename = `Bolus-Calc-RAW-${date}.json`;

            await Filesystem.writeFile({
                path: filename,
                data: data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });

            const uriResult = await Filesystem.getUri({
                directory: Directory.Documents,
                path: filename
            });

            const path = uriResult.uri;

            this.jsonLoader = false;

            // Not an ideal solution, but works for now. // https://stackoverflow.com/questions/67943445/capacitor-3-and-vuejs-open-saved-file-or-download?newreg=e131f0a8e4b94d3abb69fa01ea38642c
            await Share.share({
                title: filename,
                text: 'JSON containing raw data from Bolus Calculator',
                url: path,
                dialogTitle: 'Export JSON',
            });
        },

        generateReportBlock(name, doc, diary, startDate, endDate, yAxis) {
            const analytics = new Analytics(diary);

            const minBloodSugar = parseFloat(window.localStorage.getItem("app_minimum_blood_sugar"));
            const maxBloodSugar = parseFloat(window.localStorage.getItem("app_maximum_blood_sugar"));

            // get required analytics.
            const analyticsResult = analytics
                 .after(startDate)
                 .before(endDate)
                 .average("bloodGlucose", "mean")
                 .percentageRange({start:minBloodSugar, end:maxBloodSugar}, "bloodGlucose", "inTarget")
                 .percentageRange({start:maxBloodSugar + 0.1}, "bloodGlucose", "high")
                 .percentageRange({end:minBloodSugar - 0.1}, "bloodGlucose", "low")
                 .timedAverage("bloodGlucose", 6);

            console.log(analyticsResult);

            // Create report block title.

            doc.setFont("Helvetica", "Bold");
            doc.setFontSize(15);
            doc.text(name, 14, yAxis);

            // Create average container.

            yAxis += 3.5;

            doc.rect(14, yAxis, 180, 100, 'S')

            // Display average symbol :) for good :( for bad.

            yAxis += 17.5;

            let face = require("../../assets/images/icons/fontAwesome/smile.png");
            if(analyticsResult.results.averages.mean.bloodGlucose < minBloodSugar || analyticsResult.results.averages.mean.bloodGlucose > maxBloodSugar) {
                face = require("../../assets/images/icons/fontAwesome/frown.png");
            }

            doc.addImage(face, "JPEG", 90, yAxis, 30, 30);

            // Display average.

            yAxis += 47.5;

            // Glucose in-range colour.
            doc.setTextColor(107, 142, 35);

            // Glucose high colour.
            if(analyticsResult.results.averages.mean.bloodGlucose > maxBloodSugar) doc.setTextColor(255, 140, 0);
            // Glucose low colour.
            if(analyticsResult.results.averages.mean.bloodGlucose < minBloodSugar) doc.setTextColor(139, 0, 0);

            doc.setFontSize(20);
            doc.text(`${analyticsResult.results.averages.mean.bloodGlucose ? analyticsResult.results.averages.mean.bloodGlucose.toFixed(1) + " mmol/L" : "N/A mmol/L"}`, 87, yAxis);

            yAxis += 10;
            
            // Sub heading

            doc.setFontSize(18);
            doc.setTextColor(0,0,0);
            doc.setFont("Helvetica", "");
                                                                                                           
            doc.text(analyticsResult.results.averages.mean.bloodGlucose ? "Average Blood Glucose Level" : "We need more data from you.", 62, yAxis);

            // rangeGraph

            yAxis += 40;

            const rangeGraph = renderGraphToImage(createRangeGraph(
                [`Higher than ${maxBloodSugar}`, `Within ${minBloodSugar} - ${maxBloodSugar}`, `Lower than ${minBloodSugar}`],
                [analyticsResult.results.range.high.toFixed(1), analyticsResult.results.range.inTarget.toFixed(1), analyticsResult.results.range.low.toFixed(1)]
            ));

            doc.setFontSize(15);
            doc.setFont("Helvetica", "");
            doc.text("Time in Target.", 14, yAxis);

            yAxis += 3.5;

            // Add range graph container.
            doc.rect(14, yAxis, 180, 100, 'S')

            yAxis += 5;

            doc.addImage((rangeGraph), "PNG", 17.5, yAxis, 170, 90);

            // Timed average glucose graph.

            doc.addPage();

            yAxis = 15;

            doc.setFont("Helvetica", "");
            doc.text("Time based average glucose.", 14, yAxis);

            yAxis += 3.5;

            doc.rect(14, yAxis, 180, 100, 'S')

            const timedAverageGraph = renderGraphToImage(createTimedAverageGraph(
                ["0:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
                analyticsResult.results.groups.timedAverage,
                minBloodSugar,
                maxBloodSugar
            ));

            yAxis += 5;

            doc.addImage((timedAverageGraph), "PNG", 20, yAxis, 170, 90);

            yAxis += 115;

            // Raw Data
            doc.setFont("Helvetica", "");
            doc.text("Raw data.", 14, yAxis);

            const body = analyticsResult.diary.map(entry => {
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

                    entry.carbohydrates || "N/A",
                    entry.bloodGlucose || "N/A",
                    entry.units || "N/A",

                    modifiers || "N/A",
                    `1:${entry.ratio}`
                ];
            });

            yAxis += 3.5;

            // Raw data table.
            autoTable(doc, {
                head: [['Date', 'Time', 'Carbohydrates', 'Blood Glucose', 'Units', 'Modifiers', 'Ratio']],
                body,
                headStyles: {
                    fillColor: '#ef4d5a'
                },
                startY: yAxis
            })
        }
    },
}
</script>

