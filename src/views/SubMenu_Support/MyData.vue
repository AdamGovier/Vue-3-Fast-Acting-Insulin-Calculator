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

            const doc = new jsPDF();

            // Branding & Title
            doc.setFontSize(30);
            doc.text("Bolus Calculator", 55, 23);
            doc.setFontSize(20);
            doc.text("Application Data", 55, 33);
            doc.addImage(this.$pdf.logo.data, "JPEG", 15, 10, 30, 30);

            const diary = JSON.parse(window.localStorage.getItem("app_diary"));

            const body = diary.map(entry => {
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
                margin: { top: 55 },
            })

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

