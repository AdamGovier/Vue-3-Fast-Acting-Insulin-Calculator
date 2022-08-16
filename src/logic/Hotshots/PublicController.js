/**
    * ! Public Bolus Calculator API WRAPPER.
*/

import axios from "axios";
import app from "@/main.js";
import SuperController from "./SuperController.js";
import Hotshot from "./Hotshot.js";

export default class PublicController extends SuperController {
    constructor(createError) {
        super(true, "Hotshots curated by other Diabetics.", createError);
    }

    async retrieveResults() {
        try {
            if(!this.filters.barcode && !this.filters.searchTerm) return [];

            // Set search type to either barcode or keyword.
            const inputType = this.filters.barcode ? "barcode" : "keyword";

            const searchValue = this.filters.barcode ??= this.filters.searchTerm;

            const response = await axios.get(`${app.config.globalProperties.$endpoint}/api/hotshots/get/${inputType}/${searchValue}`);

            // If no response return an empty array.
            const hotshots = response.data ? createHotshots(response.data) : [];

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
        return new Hotshot(entry.id, entry.name, entry.carbs, entry.weight, entry.img);
    }).reverse(); 
}