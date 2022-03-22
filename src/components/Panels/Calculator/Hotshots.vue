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
                    <Input type="text" placeholder="Search.." :value="search.value" @new-data="value => {search.value = value;}" @data-changed="search.searchType = 'keyword'; populateHotshots();" />
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
                <p v-if="!results.local.length">No results found.</p>

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
                <p v-if="search.value">No results found.</p>

            <h3 v-if="search.value" style="font-weight: normal; margin-top: 20px;">Open Food Facts</h3>
                <p v-if="search.value && !results.open_food_facts.length">No results found.</p>

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
                open_food_facts: false
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
                this.results.bolus_calculator_api = await this.getResults("bolus_calculator_api", this.search.searchType, this.search.value);
                this.results.open_food_facts = await this.getResults("open_food_facts", this.search.searchType, this.search.value);
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
                    return findLocalResults(inputType, searchValue);
                    break;
                case "bolus_calculator_api":
                    return findResultsFromBolusCalculatorAPI(inputType, searchValue);
                    break;
                case "open_food_facts":
                    this.loaders.open_food_facts = true;
                    const results = await findResultsFromOpenFoodFacts(inputType, searchValue);
                    this.loaders.open_food_facts = false;
                    return results;
                    break;
                default:
                    throw new Error("Data source not supported"); // For developers rather than users.
                    break;
            }

            // Find hotshots from localStorage
            function findLocalResults(inputType, searchValue) {
                const hotshots = storage.getItem("app_local_hotshots") ? JSON.parse(storage.getItem("app_local_hotshots")) : [];
                if(!inputType || !searchValue) return hotshots; // If no search value is provided.

                switch (inputType) {
                    case "barcode":
                        return searchByBarcode(hotshots, searchValue);
                        break;
                    case "keyword":
                        return searchByKeyword(hotshots, searchValue);
                        break;
                }

                // Find results from localStorage which match a barcode number.
                function searchByBarcode(hotshots, searchValue) {
                    return hotshots.filter(
                        hotshot => hotshot.barcode === searchValue
                    );
                }

                // Find results from localStorage which include a keyword in their name.
                function searchByKeyword(hotshots, searchValue) {
                    return hotshots.filter(
                        hotshot => hotshot.name.toLowerCase().includes(
                            searchValue.toLowerCase()
                        )
                    );
                }
            }

            // Find results from an inhouse api with results submitted by the apps users.
            async function findResultsFromBolusCalculatorAPI(inputType, searchValue) {
                // requires implementation
                return [];
            }

            // Find results from Open Food Facts a database of nutritional values.
            async function findResultsFromOpenFoodFacts(inputType, searchValue) {
                if(!inputType || !searchValue) return []; // Don't return any products by default e.g. without any search values.

                switch (inputType) {
                    case "barcode":
                        return await searchByBarcode(searchValue);
                        break;
                    case "keyword":
                        return await searchByKeyword(searchValue);
                        break;
                }

                async function searchByBarcode(searchValue) {
                    try {
                        const response = 
                            await axios.get(`https://world.openfoodfacts.org/api/v2/product/${searchValue}`);

                        return parseData({products:[response.data.product]}); // products:[returnedProduct]
                    } catch (e) {
                        return [];
                    }
                }

                async function searchByKeyword(searchValue) {
                    try {
                        const response = 
                            await axios.get(`https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${searchValue}&search_simple=1&action=process&json=1`);

                        return parseData(response.data);
                    } catch (e) {
                        return [];
                    }
                }

                // Parse results into a format that bolus calculator can understand.
                function parseData(data) {
                    if(!data.products) { // if no products
                        return []; // return empty array
                    } 

                    const results = data.products.map(product => { // Get required data
                        return {
                            name: product.product_name,
                            weight: product.serving_size ? product.serving_size.split("g")[0] : undefined, // if grams is in the digit.
                            img: product.image_url,
                            carbs: product.nutriments.carbohydrates_serving,
                            id: product._id
                        }
                    })

                    return results.filter(product => product.name && product.weight && product.carbs)
                }
            }
        },
    }, 
}
</script>