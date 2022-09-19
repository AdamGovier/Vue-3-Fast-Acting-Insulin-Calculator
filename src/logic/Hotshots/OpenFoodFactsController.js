/**
    * ! OpenFoodFacts API WRAPPER.
*/

import SuperController from "./SuperController.js";
import Hotshot from "./Hotshot.js";
import axios from "axios";
import Stopwatch from "statman-stopwatch";

export default class OpenFoodFactsController extends SuperController {
    constructor(createMessage) {
        super(true, true, createMessage);
    }

    async retrieveResults() {
        // Timer
        const stopwatch = new Stopwatch(true);

        // If barcode is not specified it will apply the search term URL instead.
        const url = getBarcodeUrl(this.filters.barcode) ?? getSearchTermURL(this.filters.searchTerm);

        let response;
        let data;

        try {
            response = await axios.get(url);

            if(!response.data) throw new Error("No response given.");
            data = response.data; 

        } catch (error) {
            if(error.response?.status !== 404) this.createMessage("An error has occurred, please try again later.");
            return [];
        }

        // Overwrite the products, if the search type is of barcode so it can fit the same format as the keyword endpoint.
        if(this.filters.barcode) {
            // Apply barcode into an array of products which only includes the scanned product.
            data = {products:[response.data.product]}
        }

        if(!data.products) return [];

        // Bind to Hotshot template.
        const results = data.products.map(product => {
            return new Hotshot(
                product._id, 
                product.product_name, 
                product.nutriments.carbohydrates_serving,
                /[0-9][g]$/.test(product.serving_size) ? product.serving_size.split("g")[0] : undefined, // return undefined if grams is not the unit of measurement.
                product.image_url
            )
        })
        // Remove any unsuitable results
        .filter(product => product.name && product.weight && product.carbs); // required fields

        // i.e. 1 Result(s) (36.10 ms)
        this.createMessage(`${results.length} ${results.length > 1 ? "Results" : "Result"} (${(stopwatch.stop()).toFixed(2)} ms)`);
        
        return results;
    }
}

function getBarcodeUrl(barcode) {
    if(!barcode) return;

    return `https://world.openfoodfacts.org/api/v2/product/${barcode}`;
}

function getSearchTermURL(keyword) {
    if(!keyword) return;

    return `https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${keyword}&search_simple=1&action=process&json=1`;
}