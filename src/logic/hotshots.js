const { Capacitor } = require('@capacitor/core');
const { Filesystem, Directory, Encoding } = require('@capacitor/filesystem');
const storage = window.localStorage;

exports.openFoodFacts = {
    // Parse the products into a format that bolus calculator can understand.
    parseData(data) {
        if(!data.products) { // if no products
            return []; // return empty array
        }

        const results = data.products.map(product => { // Get required data
            return {
                name: product.product_name,
                weight: /[0-9][^a-f h-z A-F H-Z]/.test(product.serving_size) ? product.serving_size.split("g")[0] : undefined, // if grams is in the digit.
                img: product.image_url,
                carbs: product.nutriments.carbohydrates_serving,
                id: product._id
            }
        });

        return results.filter(product => product.name && product.weight && product.carbs);
    }
}

exports.local = {
    // Find hotshots from localStorage
    async findLocalResults(inputType, searchValue) {
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
        const hotshots = (await Promise.all(hotshotPromises)).reverse();

        if(!inputType || !searchValue) return hotshots; // If no search value is provided.

        // Search type.
        switch (inputType) {
            case "barcode":
                return searchByBarcode(hotshots, searchValue);
            case "keyword":
                return searchByKeyword(hotshots, searchValue);
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
}