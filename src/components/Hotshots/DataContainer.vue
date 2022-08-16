<template>
<div>
    <h3 style="font-weight: normal;">{{ type }}</h3>
        <p class="hotshotError">{{ errorDescription }}</p>

    <!-- Loading Spinner -->
    <Loader v-if="showLoader" />

    <div class="hotshotGrid">
        <!-- Loop through every hotshot returned from the API in use. -->
        <div v-for="hotshot in this.results" style="width: 95%;">
            <Hotshot
                :hotshot="hotshot" 
             
                @selectHotshot="selectHotshot(hotshot.id, hotshot.carbs)"
                @deductHotshot="deductHotshot(hotshot.id, hotshot.carbs)"
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
        this.results = await this.controller.retrieveResults();
    },
    data() {
        return {
            results: [],
            total: 0,
            showLoader: false,
            cached: {
                searchTerm: null,
                barcode: null
            },
            controller: new this.Controller(this.createError),
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
            if(this.searchTerm === this.cached.searchTerm && this.barcode === this.cached.barcode) return;

            // Hide previous results when searching.
            this.results = [];

            // Show loader if applicable.
            if(this.controller.showLoader) this.showLoader = true;

            // Set caches to allow the check for changed search filters.
            this.cached.searchTerm = this.searchTerm;
            this.cached.barcode = this.barcode;

            // Execute the search.
            this.results = await this.controller.searchByTerm(this.searchTerm).searchByBarcode(this.barcode).retrieveResults();

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
        createError(message) {
            this.errorOverride = message;
        }
    }
}
</script>