<template>
<div v-if="!this.controller.requireSearch || (this.controller.requireSearch && (this.searchTerm || this.barcode))">
    <h3 style="font-weight: normal;">{{ type }}</h3>
        <p v-if="!searchInProgress" class="hotshotError">{{ errorDescription }}</p>

    <!-- Loading Spinner -->
    <Loader v-if="showLoader" />

    <div class="hotshotGrid">
        <!-- Loop through every hotshot returned from the API in use. -->
        <div v-for="hotshot in this.results" style="width: 95%;">
            <Hotshot
                :hotshot="hotshot" 
             
                @selectHotshot="selectHotshot(hotshot.id, hotshot.carbs)"
                @deductHotshot="deductHotshot(hotshot.id, hotshot.carbs)"
                @edit="hotshot => this.$emit('hotshotEdit', hotshot)"

                :editEnabled="this.controller.editable"
                :selected="countSelections(hotshot.id)"
            />
        </div>
    </div> 
</div>

</template>

<style scoped>
    .hotshotError {
        font-size: 15px;
        color: gray;
    }

    .hotshotGrid {
        margin-top: var(--margin-sm);

        display: grid;
        grid-template-columns: 50% 50%;
        row-gap: var(--margin-sm);
        column-gap: 3%;
    }
</style>

<script>
// Components
import Hotshot from "@/components/Hotshots/Hotshot.vue";
import Loader from "@/components/Other/Loader.vue";

export default {
    components: {
        Hotshot,
        Loader
    },
    props: ["type", "Controller", "searchTerm", "barcode"],
    async mounted() {
        // If hotshots of this API are edited.
        this.emitter.on("reload-hotshots", async apiType => {  
            if(apiType !== this.type) return;

            this.results = await this.controller.searchByTerm(this.searchTerm).searchByBarcode(this.barcode).retrieveResults();
        });

        this.results = await this.controller.retrieveResults();
    },
    data() {
        return {
            results: [],
            total: 0,
            showLoader: false,
            cached: {
                searchTerm: "",
                barcode: ""
            },
            controller: new this.Controller(this.createMessage),
            searchInProgress: false,
            errorOverride: null // Change error message from the automatic messages i.e. "No results found." or the category descriptor.
        }
    },
    computed: {
        errorDescription() {
            if(this.errorOverride) return this.errorOverride;
            if(!this.results.length) return "No results found.";

            return this.controller.blurb;
        }
    },
    async updated() {
        // If search term in paticular has changed.
        this.filterHotshots();
    },
    methods: {
        async filterHotshots() {
            // console.log("keyword:", this.searchTerm,  this.cached.searchTerm,  this.cached.searchTerm == this.searchTerm);
            // console.log("barcode:", this.barcode,  this.cached.barcode,  this.cached.barcode == this.barcode);

            if(this.searchTerm === this.cached.searchTerm && this.barcode === this.cached.barcode) return;

            this.searchInProgress = true;
            this.errorOverride = false;

            // Hide previous results when searching.
            this.results = [];

            // Show loader if applicable.
            if(this.controller.showLoader) this.showLoader = true;

            const barcodeSearch = this.cached.barcode !== this.barcode && this.barcode;


            // Set caches to allow the check for changed search filters.
            this.cached.searchTerm = this.searchTerm;
            this.cached.barcode = this.barcode;

            // Execute the search.
            this.results = await this.controller.searchByTerm(this.searchTerm).searchByBarcode(this.barcode).retrieveResults();

            // Search finished.
            if(barcodeSearch) this.$emit('processed', !!this.results.length);
            this.searchInProgress = false;

            // Hide Loaders
            this.showLoader = false;
        },
        selectHotshot(id, changeAmt) {
            this.controller.selectHotshot(id);
            this.$emit("updateTotal", changeAmt);
            this.$forceUpdate(); 
        },
        deductHotshot(id, changeAmt) {
            this.controller.deductHotshot(id);
            this.$emit("updateTotal", changeAmt * -1);
            this.$forceUpdate(); 
        },
        countSelections(id) {
            return this.controller.countSelections(id);
        },
        createMessage(message) {
            this.errorOverride = message;
        }
    }
}
</script>