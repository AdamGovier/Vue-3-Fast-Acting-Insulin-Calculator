/**
    * ! In-House Bolus Calculator API WRAPPER.
*/

import axios from "axios";
import app from "@/main.js";
import SuperController from "./SuperController.js";
import Hotshot from "./Hotshot.js";
import Stopwatch from "statman-stopwatch";

export default class PublicController extends SuperController {
    constructor(createMessage) {
        // show loading spinner, require filters. 
        super(true, true, createMessage);
    }

    async retrieveResults() {
        try {
            // Timer used to measure response time.
            const stopwatch = new Stopwatch(true);

            // Set search type to either barcode or keyword.
            const inputType = this.filters.barcode ? "barcode" : "keyword";

            // Set the value to either barcode or keyword.
            const searchValue = this.filters.barcode ??= this.filters.searchTerm;

            // The domain is provided in main.js under config.globalProperties.$endpoint.
            const response = await axios.get(`${app.config.globalProperties.$endpoint}/api/hotshots/get/${inputType}/${searchValue}`);

            // If no response set it to an empty array.
            const hotshots = response.data ? createHotshots(response.data) : [];

            // i.e. 1 Result(s) (36.10 ms)
            this.createMessage(`${hotshots.length} ${hotshots.length > 1 ? "Results" : "Result"} (${(stopwatch.stop()).toFixed(2)} ms)`);

            return hotshots;
        } catch(error) {
            if(error.response?.status !== 404) this.createError("An error has occurred, please try again later.");
            return [];
        }
    }
}

/**
 * @description Generates an array of Hotshots from the template Hotshot class & binds an image url 
 * using the endpoint and image path provided from the server.
 * 
 * @param {Array} unparsedHotshots JSON data recieved from the server.
 * @returns Valid array of Hotshots.
 */
function createHotshots(unparsedHotshots) {
    return unparsedHotshots.map(entry => {
        // set thumbnail url
        entry.img = `${app.config.globalProperties.$endpoint}/api/hotshots/thumbnail/${entry.imagePath}`; 

        // Apply to template
        return new Hotshot(entry.id, entry.name, entry.carbs, entry.weight, entry.img, entry.barcode);
    }).reverse(); 
}