export default class SuperController {
    constructor(showLoader, requireSearch, createMessage) {
        this.selected = [];
        this.showLoader = showLoader;
        this.createMessage = createMessage;
        this.requireSearch = requireSearch;

        this.filters = {
            searchTerm: null,
            barcode: null
        };
    }

    /**
     * @param {String} keyword The search term needed to find the product (EAN).
     */
    searchByTerm(keyword) {
        this.filters.searchTerm = keyword;

        return this;
    }

    /**
     * @param {String} barcode The barcode needed to find the product (EAN).
     */
    searchByBarcode(barcode) {
        this.filters.barcode = barcode;

        return this;
    }

    selectHotshot(hotshotID) {        
        if(isHotshotSelected(this.selected, hotshotID)) {
            this.selected = incOrDecSelection(this.selected, hotshotID);
        } else {
            this.selected.push(
                {
                    id: hotshotID,
                    count: 1
                }
            )
        }
    }

    deductHotshot(hotshotID) {
        if(isHotshotSelected(this.selected, hotshotID)) {
            this.selected = incOrDecSelection(this.selected, hotshotID, true);
        }
    }

    countSelections(hotshotID) {
        if(!isHotshotSelected(this.selected, hotshotID)) return 0;

        return this.selected.filter(hotshot => hotshot.id === hotshotID)[0].count;
    }
}

function isHotshotSelected(selectedArray, hotshotID) {
    return selectedArray.some(hotshot => hotshot.id === hotshotID)
}

function incOrDecSelection(selectedArray, hotshotID, decrease) {
    return selectedArray.map(hotshot => {
        if(hotshot.id !== hotshotID) return hotshot;

        // Increase or decrease number of times a hotshot selected.
        decrease ? hotshot.count-- : hotshot.count++;
        return hotshot;
    });
}