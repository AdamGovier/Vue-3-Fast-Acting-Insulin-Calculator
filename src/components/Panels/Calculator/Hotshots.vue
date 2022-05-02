<template>
    <section class="horizCentre">
        <div @click="this.$emit('updateCarbs', totalCarbs)" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem v-if="!totalCarbs" title="Continue" icon="fas fa-calculator" slimline="true" /> 
            <MenuItem v-if="totalCarbs" :title="`Continue (${totalCarbs}g of Carbs)`" icon="fas fa-calculator" slimline="true" /> 
        </div>

        <div style="width: 95%; margin-top: 20px;">
            <Option>
                <InputArea>

                    <Input type="text" placeholder="Search.." 

                     :value="search.value"
                     
                     @new-data="
                        noDataReason.bolus_calculator_api = '';
                        noDataReason.open_food_facts = '';
                     " 

                     @data-changed="
                        value => {
                            search.value = value;
                            search.searchType = 'keyword'; 
                            populateHotshots();
                        }
                     " 

                    />

                    <InputButton icon="fas fa-camera" @click="scanBarcode();" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Welcome to Hotshots! This area allows you to record repeative carbohydrate counts.
                    </template>
                </OptionLabel>
            </Option>
        </div>

        <div style="width: 95%; margin-top: 20px; margin-bottom: 100px;">
            <h3 style="font-weight: normal;">Hotshots</h3>
                <p class="hotshotError" v-if="!results.local.length">No results found.</p>

            <div class="hotshotGrid">
                <!-- Render hotshots from localstorage -->
                <div v-for="hotshot in results.local">
                    <!-- Add 1 if already exists otherwise set to 1 -->
                    <Hotshot
                        @edit="hotshotToEdit => {editHotshot = hotshotToEdit; panels.manager = true;}"
                        @add="hotshot => {
                            cached.push(hotshot);
                            selected[hotshot.id] ? selected[hotshot.id]++ : selected[hotshot.id] = 1;
                        }"
                        @deduct="selected[hotshot.id]--;"
                        :hotshot="{
                            ...hotshot,
                            selected: selected[hotshot.id]
                        }"
                    />
                </div>
            </div>

            <h3 v-if="search.value" style="font-weight: normal; margin-top: 20px;">Submtted by Users</h3>
                <p class="hotshotError" v-if="!results.bolus_calculator_api.length && search.value">{{ noDataReason.bolus_calculator_api }}</p>
            
            <!-- Loading Spinner -->
            <Loader v-if="loaders.bolus_calculator_api"/>

            <!-- Load hotshots from Bolus Calculator API -->
            <div class="hotshotGrid" v-if="results.bolus_calculator_api.length && search.value">
                <Hotshot 
                    @add="hotshot => {
                        cached.push(hotshot)
                        selected[hotshot.id] ? selected[hotshot.id]++ : selected[hotshot.id] = 1;
                    }"
                    @deduct="selected[hotshot.id]--;"

                    disableEdit="true"

                    v-for="hotshot in results.bolus_calculator_api" :hotshot="{
                        ...hotshot,
                        selected: selected[hotshot.id]
                    }"
                />
            </div>

            <h3 v-if="search.value" style="font-weight: normal; margin-top: 20px;">Open Food Facts</h3>
                <p class="hotshotError" v-if="search.value && !results.open_food_facts.length">{{ noDataReason.open_food_facts }}</p>

            <!-- Loading Spinner -->
            <Loader v-if="loaders.open_food_facts"/>

            <!-- Load hotshots from Open Food Facts API -->
            <div class="hotshotGrid" v-if="results.open_food_facts.length && search.value">
                <Hotshot 
                    @add="hotshot => {
                        cached.push(hotshot)
                        selected[hotshot.id] ? selected[hotshot.id]++ : selected[hotshot.id] = 1;
                    }"
                    @deduct="selected[hotshot.id]--;"

                    disableEdit="true"

                    v-for="hotshot in results.open_food_facts" :hotshot="{
                        ...hotshot,
                        selected: selected[hotshot.id]
                    }"
                />
            </div>

            <!-- Add hotshot footer -->
            <div id="addHotshotFooter">
                <ButtonSecondary @click="editHotshot = null; panels.manager = true;">
                    <i class="fas fa-camera"></i>
                    <span>Create a new hotshot</span>
                </ButtonSecondary>
            </div>

            <BarcodeScannerUI 
                @close="
                    panels.barcodeUI = false;
                    emitter.emit('hide-ui', false);
                "
                v-if="panels.barcodeUI" 
            />

            <transition name="slide">
                <Panel v-if="panels.manager">
                    <HotshotManager :barcode="this.search.searchType === 'barcode' ? this.search.value : null" :hotshot="editHotshot" @close="panels.manager = false; populateHotshots();" />
                </Panel>
            </transition>
        </div>
    </section>


</template>

<style>
    #addHotshotFooter {
        width: 100%;

        position: fixed;
        bottom: 0;
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

    .hotshotGrid {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 48.5% 48.5%;
        row-gap: 20px;
        column-gap: 3%;
    }

    .hotshotError {
        font-size: 15px;
        color: gray;
    }

</style>

<script>
import axios from "axios";

import Option from "../../Options/Option.vue";
import InputArea from "../../Options/InputArea.vue";
import Input from "../../Options/Input.vue";
import InputLabel from "../../Options/InputLabel.vue";
import InputButton from "../../Options/InputButton.vue";
import OptionLabel from "../../Options/OptionLabel.vue";

import PannelHeader from "../Components/PanelHeader.vue";
import MenuItem from "../../menu/MenuItem.vue";
import ButtonSecondary from "../../Buttons/Secondary.vue";
import Hotshot from "../../Other/Hotshot.vue";
import Loader from '../../Other/Loader.vue';

import BarcodeScannerUI from '../../Other/BarcodeScannerUI.vue';

import Panel from "../Panel.vue";
import HotshotManager from "./Hotshots/Manager.vue";

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {roundPointFive} from "../../../logic/utilities";
import hotshots from "../../../logic/hotshots";

const storage = window.localStorage;

export default {
    components: {
        MenuItem,
        PannelHeader,
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        ButtonSecondary,
        Hotshot,
        Loader,
        Panel,
        HotshotManager,
        BarcodeScannerUI
    },
    data() {
        return {
            results: {
                local: [],
                bolus_calculator_api: [],
                open_food_facts: []
            },
            search: {
                value: undefined,
                searchType: "keyword"
            },
            panels: {
                barcodeUI: false,
                manager: false
            },
            loaders: {
                open_food_facts: false,
                bolus_calculator_api: false,
            },
            noDataReason: {
                open_food_facts: "",
                bolus_calculator_api: ""
            },
            cached: [],
            selected: {},
            editHotshot: undefined
        }
    },
    computed: { 
        totalCarbs() {
            let total = 0;

            for(let hotshotID of Object.keys(this.selected)) {
                const found = this.cached.filter(hotshot => hotshot.id === hotshotID);
                if(found.length) { // If found the hotshot within the cached hotshots.
                    total += 
                        found[0].carbs
                        * this.selected[hotshotID];
                }
            }

            return roundPointFive(total);
        },
    },
    mounted() {
        this.populateHotshots();
    },
    methods: {
        async populateHotshots() {
            this.results.local = [];
            this.results.bolus_calculator_api = [];
            this.results.open_food_facts = [];

            this.results.local = await this.getResults("local", this.search.searchType, this.search.value);

            if(this.search.value) {
                this.results.bolus_calculator_api 
                    = await this.getResults("bolus_calculator_api", this.search.searchType, this.search.value);
                this.results.open_food_facts
                     = await this.getResults("open_food_facts", this.search.searchType, this.search.value);
            }

            return;
        },

        async scanBarcode() {
            // this.search.value = "510010005";
            // this.search.searchType = "barcode";
            // await this.populateHotshots();

            const status = await BarcodeScanner.checkPermission({ force: true });

            if(!status.granted) return window.alert("Please allow Bolus Calculator to use your camera in your system settings.");

            this.panels.barcodeUI = true;
            this.emitter.emit('hide-ui', true);

            const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

            // if the result has content
            if (result.hasContent) {
                BarcodeScanner.stopScan();

                this.panels.barcodeUI = false;
                this.emitter.emit('hide-ui', false);

                this.search.value = result.content;
                this.search.searchType = "barcode";

                await this.populateHotshots();

                if(this.results.open_food_facts.length || this.results.bolus_calculator_api.length || this.results.local.length) return;

                const confirm = window.confirm("There are no products on record for this barcode, would you like to create a hotshot for it?")
                if(confirm) { // show hotshot creator
                    this.editHotshot = null; 
                    this.panels.manager = true; 
                } 
            }
        },

        /**
         * @param {String} source the location of the data to gather from. (local, bolus_calculator_api or open_food_facts)
         * @param {String} type "barcode" to search by barcode || "keyword" to search by name.
         * @param {String} searchValue barcode number or search keywords.
         */
        async getResults(source, inputType, searchValue) {
            switch (source) {
                case "local":
                    return hotshots.local.findLocalResults(inputType, searchValue);
                    break;

                case "bolus_calculator_api":
                    // Enable loading symbol.
                    this.loaders.bolus_calculator_api = true;

                    const bolus_calculator_api_results 
                        = await this.findResultsFromBolusCalculatorAPI(inputType, searchValue);

                    // Disable loading symbol.
                    this.loaders.bolus_calculator_api = false;

                    return bolus_calculator_api_results;
                    break;

                case "open_food_facts":
                    // Enable loading symbol.
                    this.loaders.open_food_facts = true;

                    const open_food_facts_results 
                        = await this.findResultsFromOpenFoodFacts(inputType, searchValue);

                    // Disable loading symbol.
                    this.loaders.open_food_facts = false;
                    
                    return open_food_facts_results;
                    break;

                default:
                    throw new Error("Data source not supported"); // For developers rather than users.
                    break;
            }
        },
        // Find results from an inhouse api with results submitted by the apps users.
        async findResultsFromBolusCalculatorAPI(inputType, searchValue) {
                if(!inputType || !searchValue) return []; // Don't return any products by default e.g. without any search values.

                try {
                    const response = 
                        await axios.get(`http://localhost:3000/api/hotshots/get/${inputType}/${searchValue}`);

                    return response.data ?? [];
                } catch (error) {
                    this.handleAxiosError(error, "bolus_calculator_api");
                    return [];
                }
        },
        // Find results from Open Food Facts a database of nutritional values.
        async findResultsFromOpenFoodFacts(inputType, searchValue) {
            if(!inputType || !searchValue) return []; // Don't return any products by default e.g. without any search values.

            let url;

            // Set the api url to query from.
            if(inputType === "barcode") {
                url = `https://world.openfoodfacts.org/api/v2/product/${searchValue}`;
            }
            // If search type is a keyword search.
            else { 
                url = `https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${searchValue}&search_simple=1&action=process&json=1`
            }

            try {
                const response = 
                    await axios.get(url);

                let products = response.data;

                // Overwrite the products variable if search type is of barcode.
                if(inputType === "barcode") {
                    // Apply barcode into an array of products only including the scanned product.
                    products = {products:[response.data.product]}
                }

                return hotshots.openFoodFacts.parseData(products);
            } catch (error) {
                this.handleAxiosError(error, "open_food_facts");
                return [];
            }
        },
        handleAxiosError(error, api) {
                if(!error.response) {
                    this.noDataReason[api] = "There has been an issue connecting to the server, have you got a stable internet connection?";
                } else {
                    if(error.response.status === 404) {
                        this.noDataReason[api] = "No results found.";
                    } else {
                        this.noDataReason[api] = "There has been an issue with the server, please try again later.";
                    }
                }
        }
    }, 
}
</script>