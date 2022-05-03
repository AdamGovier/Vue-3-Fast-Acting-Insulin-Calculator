export default {
    /**
     * Get's a mean average of required property from the diary provided.
     * @param Array diary An array of bolus calculator diary entry objects.
     * @param String property, the property inside the diary entry object to get an average of.
     * @param Boolean incZeroEntries, Default: False, Include or exclude zero/undefined values in the average. 
     */
    getMean(diary, property, incZeroEntries = false) {
        const total = diary.reduce((total, next) => total + parseFloat(next[property]), 0);
        const countedEntries = incZeroEntries ? diary.length 
        : getCount();
    
        return total / countedEntries;
    
        function getCount() {
            let count = 0;
            diary.forEach(entry => {
                // if zero it will return false.
                if(parseFloat(entry[property])) count++;
            });
            return count;
        }
    },

    /**
     * Get's a median average of required property from the diary provided.
     * @param Array diary An array of bolus calculator diary entry objects.
     * @param String property, the property inside the diary entry object to get an average of.
     */
    getMedian(diary, property) {
        const diaryProptASC = diary.sort((a,b) => a[property] - b[property]); // Sort diary by property ascending.
        
        // https://stackoverflow.com/questions/20904368/javascript-finding-the-most-middle-value-in-an-array
        const middleOfArray = Math.floor(diaryProptASC.length / 2);
        return diaryProptASC[middleOfArray][property];
    },

    getMode(diary, property) {
        let counts = {};

        // Create multiple key:value with the Property against the number of times it occurs.

        diary.forEach(entry => {
            if(!counts[entry[property]]) counts[entry[property]] = 0;
            counts[entry[property]]++;
        })


        let maxCount = 0;
        let maxKey;

        for (const [key, count] of Object.entries(counts)) {
            if(count > maxCount) {
                maxCount = count;
                maxKey = key;
            }
        }

        return maxKey;
    }
}
