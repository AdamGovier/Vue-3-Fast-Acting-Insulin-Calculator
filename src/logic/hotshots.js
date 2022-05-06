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
        const hotshots = storage.getItem("app_local_hotshots") ? JSON.parse(storage.getItem("app_local_hotshots")) : [];
        if(!inputType || !searchValue) return hotshots; // If no search value is provided.

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