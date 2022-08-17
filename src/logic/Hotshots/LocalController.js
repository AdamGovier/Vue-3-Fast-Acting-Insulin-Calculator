/**
    * ! Local Hotshots API WRAPPER.
*/

import { Capacitor } from '@capacitor/core'; 
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import SuperController from "./SuperController.js";
import Hotshot from "./Hotshot.js";

const storage = window.localStorage;

export default class LocalContoller extends SuperController {
    constructor(createMessage) {
        super(true, false, createMessage);
        this.editable = true;
    }

    async retrieveResults() {
        // Retrieve an array of hotshots.
        const rawHotshots = storage.getItem("app_local_hotshots") ? JSON.parse(storage.getItem("app_local_hotshots")) : [];


        // Create a map to return webpath of images.
        const hotshotPromises = rawHotshots.map(async hotshot => {
            if(!hotshot.img) return hotshot;

            const photo = await Filesystem.getUri({
                directory: Directory.Data,
                path: hotshot.img
            });

            hotshot.imgFilename = hotshot.img; // For the hotshot manager to have access to the filename.
            hotshot.img = Capacitor.convertFileSrc(photo.uri);
            
            return hotshot;
        });


        // Run all the promises to return parsed hotshot. // reverse to show recently created / modified hotshots.
        let hotshots = (await Promise.all(hotshotPromises)).reverse();

        // Bind to hotshot template.
        hotshots = hotshots.map(hotshot => new Hotshot(hotshot.id, hotshot.name, hotshot.carbs, hotshot.weight, hotshot.img, hotshot.barcode));

        // Conditional these functions will return original results if second argument is empty (undefined || null).
        hotshots = searchByTerm(hotshots, this.filters.searchTerm);
        hotshots = searchByBarcode(hotshots, this.filters.barcode);

        // i.e. 1 Result(s)
        if(hotshots.length) this.createMessage(`${hotshots.length} ${hotshots.length > 1 ? "Results" : "Result"}`);
        
        // This might look bizarre but this is more of a physiological feature rather than a practical function. 
        // I found that when searching for a hotshot this function would show the results so fast my brain instantly would not realise the search
        // occured at all. So a subtle delay allows a loading spinner to show before the results are presented hinting at the user that a
        // search has occured. 
        if(this.filters.searchTerm || this.filters.barcode) await new Promise((resolve, reject) => setTimeout(resolve, 150));

        // Clear any search filters for next round of results.
        this.filters = {}; 

        return hotshots;
    }
}

// Find results from localStorage which match a barcode number.
function searchByBarcode(results, barcode) {
    // If no barcode is provided return original results.
    if(!barcode) return results;
    // Find hotshots with field barcode matching provided barcode.
    return results.filter(
        hotshot => hotshot.barcode === barcode
    );
}

// Find results from localStorage which include a keyword in their name.
function searchByTerm(results, searchTerm) {
    // If no searchTerm is provided return original results.
    if(!searchTerm) return results;

    // Simply filter out strings not containing the keyword.
    return results.filter(
        hotshot => hotshot.name.toLowerCase().includes(
            searchTerm.toLowerCase()
        )
    );
}
