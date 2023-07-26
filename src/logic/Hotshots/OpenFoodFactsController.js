/**
    * ! OpenFoodFacts API WRAPPER.
*/

import SuperController from "./SuperController.js";
import Hotshot from "./Hotshot.js";
import axios from "axios";
import Stopwatch from "statman-stopwatch";
import app from "@/main.js";

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
            // Request timeout if for example server is down and request doesn't make it through.
            const abortController = new AbortController();

            setTimeout(() => abortController.abort(), app.config.globalProperties.$timeout);

            // OpenFoodFacts API appears to have slowed down alot, I have removed the timeout for now.
            // https://world.openfoodfacts.org/donate-to-open-food-facts?utm_source=off&utf_medium=web&utm_campaign=donate-2023&utm_term=en-text-button
            response = await axios.get(url, {
                // signal: abortController.signal
            });

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
                normalizeWeight(product.serving_size),
                product.image_url,
                null,
                null
            )
        })
        // Remove any unsuitable results
        .filter(product => product.name && product.weight && product.carbs); // required fields

        // i.e. 1 Result(s) (36.10 ms)
        if(results.length) this.createMessage(`${results.length} ${results.length > 1 ? "Results" : "Result"} (${(stopwatch.stop()).toFixed(2)} ms)`);
        
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

/**
 * Normalizes a weight string by adding a space between the number and the unit if there isn't one already.
 * i.e, 100g -> 100 g, 100ml -> 100 ml etc.
 * The reason for this is some results had spaces inbetween the unit and some did not.
 * 
 * @param {string} weightStr - The weight string to be normalized.
 * @returns {string} The normalized weight string.
 */
function normalizeWeight(weightStr) {
    if(!weightStr) return undefined;

    // Use regular expression to find a number followed by optional whitespace and then characters
    const match = weightStr.match(/(\d+)\s*(\D+)/);
    if (match) {
      const number = match[1];
      const unit = match[2];
      const normalizedStr = `${number} ${unit.trim()}`;
      return normalizedStr;
    }
    return weightStr;
}