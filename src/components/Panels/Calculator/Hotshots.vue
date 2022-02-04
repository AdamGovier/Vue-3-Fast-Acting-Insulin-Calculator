<template>
    <section class="horizCentre">
        <div @click="this.$emit('updateCarbs', getTotalCarbs)" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem v-if="!getTotalCarbs" title="Continue" icon="fas fa-calculator" slimline="true" /> 
            <MenuItem v-if="getTotalCarbs" :title="`Continue (${getTotalCarbs}g of Carbs)`" icon="fas fa-calculator" slimline="true" /> 
        </div>

        <div style="width: 95%; margin-top: 20px;">
            <Option>
                <InputArea>
                    <Input :value="searchValue" @new-data="value => {this.searchValue = value; openFoodFactsLoading = true; apiResults=[];}" @data-changed="searchOpenFoodFacts()" type="text" placeholder="Search.."/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Welcome to Hotshots! This area allows you to record repeative carbohydrate counts.
                    </template>
                </OptionLabel>
            </Option>
        </div>

        <div style="width: 95%; margin-top: 20px;">
            <h3 style="font-weight: normal;">Hotshots</h3>
            <div class="hotshotGrid">
                <!-- Render hotshots from localstorage -->
                <div v-for="hotshot in myParsedHotshots">
                    <!-- Add 1 if already exists otherwise set to 1 -->
                    <Hotshot 
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
            <h3 v-if="searchValue" style="font-weight: normal; margin-top: 20px;">Submtted by Users</h3>
            <p v-if="searchValue">No results found.</p>
            <h3 v-if="searchValue" style="font-weight: normal; margin-top: 20px;">Open Food Facts</h3>
            <!-- Loading Spinner -->
            <Loader v-if="openFoodFactsLoading && searchValue" />
            <!-- Load hotshots from Open Food Facts API -->
            <div class="hotshotGrid" v-if="openFoodFacts.length && searchValue">
                <Hotshot 
                @add="hotshot => {
                    cached.push(hotshot)
                    selected[hotshot.id] ? selected[hotshot.id]++ : selected[hotshot.id] = 1;
                }"
                @deduct="selected[hotshot.id]--;"
                v-for="hotshot in openFoodFacts" disableEdit="true" :hotshot="{
                    ...hotshot,
                    selected: selected[hotshot.id]
                }"/>
            </div>
            <p v-if="searchValue && !openFoodFacts.length && !openFoodFactsLoading">No results found.</p>
        </div>
    </section>
</template>

<style scoped>
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

import MenuItem from "../../menu/MenuItem.vue";
import PannelHeader from "../Components/PanelHeader.vue";
import Option from "../../Options/Option.vue";
import InputArea from "../../Options/InputArea.vue";
import Input from "../../Options/Input.vue";
import InputLabel from "../../Options/InputLabel.vue";
import OptionLabel from "../../Options/OptionLabel.vue";
import ButtonSecondary from "../../Buttons/Secondary.vue";

import Hotshot from "../../Other/Hotshot.vue";

import Loader from '../../Other/Loader.vue';

export default {
    components: {
        MenuItem,
        PannelHeader,
        Option,
        InputArea,
        Input,
        InputLabel,
        OptionLabel,
        ButtonSecondary,
        Hotshot,
        Loader
    },
    data() {
        return {
            myHotshots: [ // Test Data
                { 
                    name: 'Slice of Pizza',
                    weight: 145,
                    carbs: 22,
                    img: 'https://www.thepackagingcompany.us/knowledge-sharing/wp-content/uploads/sites/2/2021/04/Supplies-for-Selling-Pizza-by-the-Slice.jpg',
                    id: "x"
                },
                { 
                    name: 'Cheese Burger',
                    weight: 113,
                    carbs: 40,
                    img: 'https://www.tasteofhome.com/wp-content/uploads/2020/03/Smash-Burgers_EXPS_TOHcom20_246232_B10_06_10b.jpg?fit=700,1024',
                    id: "y"
                }
            ],
            apiResults: [],
            cached: [],
            searchValue: "",
            openFoodFactsLoading: false,
            selected: {}
        }
    },
    computed: {
        getTotalCarbs() {
            let total = 0;

            for(let hotshotID of Object.keys(this.selected)) {
                const found = this.cached.filter(hotshot => hotshot.id === hotshotID);
                if(found.length) { // If found the hotshot within the cached hotshots.
                    total += 
                        found[0].carbs
                        * this.selected[hotshotID];
                }
            }

            return total;
        },
        myParsedHotshots() { // myHotshots after a search is counted in for.
            if(!this.searchValue) return this.myHotshots;
            return this.myHotshots.filter(hotshot => hotshot.name.toLowerCase().includes(this.searchValue.toLowerCase()));
        },
        openFoodFacts() { // Parse the hotshot menu
            if(!this.apiResults.products) return [];

            const results = this.apiResults.products.map(product => { // Get required data
                return {
                    name: product.product_name,
                    weight: product.serving_size ? product.serving_size.split("g")[0] : undefined, // if grams is in the digit.
                    img: product.image_url,
                    carbs: product.nutriments.carbohydrates_serving,
                    id: product._id
                }
            })

            this.openFoodFactsLoading = false; // Hide the spinner
            return results.filter(product => product.name && product.weight && product.carbs && product.img)
        }
    },
    methods: {
        searchOpenFoodFacts() {
            axios.get(`https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${this.searchValue}&search_simple=1&action=process&json=1`)
            .then(res => {
                this.apiResults = res.data;
            })
        }
    }
}
</script>