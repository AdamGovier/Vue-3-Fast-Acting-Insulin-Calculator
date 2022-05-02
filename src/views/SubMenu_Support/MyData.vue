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

import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';
import BtnSecondary from '../../components/Buttons/Secondary.vue';

export default {
    components: {
        PannelHeader,
        BtnSecondary
    },
    methods: {
        exportPDF() {
            console.log("Attempting to export.");

            const doc = new jsPDF();

            // Branding & Title
            doc.setFontSize(30);
            doc.text("Bolus Calculator", 55, 23);
            doc.setFontSize(20);
            doc.text("Application Data", 55, 33);
            doc.addImage(this.$pdf.logo.data, "JPEG", 15, 10, 30, 30);


            // Raw Data
            autoTable(doc, {
                head: [['Date', 'Time', 'Carbohydrates', 'Blood Glucose', 'Units', 'Modifiers', 'Ratio']],
                body: [
                    ['02/05/2022', '11:09', 80, 8.1, 13.5, 'N/A', '1:8'],
                    ['02/05/2022', '14:23', 95, 13.2, 16.5, 'Work ( +20% )', '1:8'],
                    // ...
                ],
                headStyles: {
                    fillColor: '#ef4d5a'
                },
                margin: { top: 60 },
            })

            doc.save("a4.pdf");
        }
    }
}
</script>

