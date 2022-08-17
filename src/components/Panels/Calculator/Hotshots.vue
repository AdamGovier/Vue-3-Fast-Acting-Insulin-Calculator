
/*
    *   What does Hotshots.vue do?

        The Hotshots pannel allows users to count there carbohydrates intake through known
        nutritional information of food products provided by public API's such as
        OpenFoodFacts or submitted by the user or other users through the use of a bespoke API.

    *   What and how do Hotshots.vue output data?
        
        You can provide the calculator with an updated total of carbohydrates 
        by firing an event labeled "updateCarbs" and 
        providing a new total of carbohydrates.
*/


<template>
    <section class="horizCentre">
        <TopBar @click="this.$emit('updateCarbs', totalCarbs)" :carbohydrates="totalCarbs" />
        <SearchBar @scanBarcode="scanBarcode()" @search="value => {filters.barcode = null; filters.searchTerm = value}" />

        <div id="HotshotsParentContainer">
            <!-- Loop through every API Wrapper defined in main.js -->
            <DataContainer 
                v-for="wrapper in this.$hotshots.apiWrappers" 

                :Controller="wrapper.Controller" 
                :searchTerm="filters.searchTerm"
                :barcode="filters.barcode"
                :type="wrapper.name" 

                @updateTotal="subTotal => this.totalCarbs += parseFloat(subTotal)" 
                @processed="barcodeFound => doesBarcodeExist(barcodeFound)"
                @hotshotEdit="hotshot => {editHotshot = hotshot; panels.hotshotManager = true;}
                /* ^ ? Show the Hotshot manager with the hotshot requesting to be edited. */"
            />
        </div>
    
        <BarcodeScannerUI 
            @close="
                panels.barcodeUI = false;
                // Enable full opacity.
                emitter.emit('hide-ui', false);
            "
            v-if="panels.barcodeUI" 
        />

        <!-- Create Hotshot footer, clicking on it brings up the Hotshot manger panel. -->
        <div id="addHotshotFooter">
            <ButtonSecondary @click="editHotshot = null; panels.hotshotManager = true;">
                <i class="fas fa-camera"></i>
                <span>Create a new hotshot</span>
            </ButtonSecondary>
        </div>

        <!-- Window to create / edit Hotshots -->
        <transition name="slide">
            <Panel v-if="panels.hotshotManager">
                <HotshotManager :barcode="this.filters.barcode" :hotshot="editHotshot" @close="panels.hotshotManager = false; this.emitter.emit('reload-hotshots', 'Hotshots')" />
            </Panel>
        </transition>
    </section>
</template>

<style>
    #HotshotsParentContainer {
        width: 95%; 
        margin-top: var(--margin-sm); 
        margin-bottom: var(--margin-lg);
    }

    #addHotshotFooter {
        width: 100%;
        position: fixed;
        bottom: 0;
        left:0;
    }
    #addHotshotFooter .secondary {
        margin: 0;
        border-radius: 0;
        width: 100%;
        padding: 30px 0 ;
    }
    #addHotshotFooter .secondary div * {
        margin: 0 10px;
    }
</style>

<script>
// Components
import TopBar from "@/components/Hotshots/TopBar.vue";
import SearchBar from "@/components/Hotshots/SearchBar.vue";
import DataContainer from "@/components/Hotshots/DataContainer.vue";
import BarcodeScannerUI from "@/components/Other/BarcodeScannerUI.vue";
import HotshotManager from "./Hotshots/Manager.vue";
import ButtonSecondary from "@/components/Buttons/Secondary.vue";
import Panel from "@/components/Panels/Panel.vue";

// Modules
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export default {
    components: {
        TopBar,
        SearchBar,
        DataContainer,
        BarcodeScannerUI,
        HotshotManager,
        ButtonSecondary,
        Panel
    },
    data() {
        return {
            totalCarbs: 0,
            filters: {
                searchTerm: "",
                barcode: ""
            },
            panels: {
                barcodeUI: false,
                hotshotManager: false
            },
            editHotshot: null, // Tells the hotshot manger to edit the hotshot provided rather than create a new one.
            barcodeFound: false, // If false after search it will show a dialog asking if you wish to create a hotshot with that barcode.
            resultsRetrieved: 0 // To check if the responses recieve matches the amount of API wrappers.
        }
    },
    methods: {
        async scanBarcode() {
            this.filters.searchTerm = null;

            // // Test code to run on desktop without compile.
            // this.filters.barcode = "30176204221003";
            // return;

            const status = await BarcodeScanner.checkPermission({ force: true });
            if(!status.granted) return window.alert("Please allow Bolus Calculator to use your camera in your system settings.");

            // Show barcode UI & hide all other UI.
            this.panels.barcodeUI = true;
            this.emitter.emit('hide-ui', true);

            const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

            // if the result has content
            if (result.hasContent) {
                this.filters.barcode = result.content;
            }

            // Hide barcode UI, show all other UI.
            this.panels.barcodeUI = false;
            this.emitter.emit('hide-ui', false);
        },
        // Do any of the API calls find a product with matching barcode.
        doesBarcodeExist(found) {
            this.resultsRetrieved++;
            if(found) this.barcodeFound = found;

            const expectedResponseCount = this.$hotshots.apiWrappers.length;
            console.log(expectedResponseCount, this.resultsRetrieved, this.barcodeFound)
            if(expectedResponseCount !== this.resultsRetrieved) return;

            if(!this.barcodeFound) {
                this.barcodeFound = false;
                
                const confirm = window.confirm("There are no products on record for this barcode, would you like to create a hotshot for it?")
                if(confirm) {
                    this.editHotshot = null;
                    this.panels.hotshotManager = true;
                }
            }

            this.resultsRetrieved = 0;
        }
    }
}
</script>