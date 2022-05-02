<template>
    <div class="diaryHolder" :class="{goodBG:bloodCategoryGood, hypoBG: bloodCategoryLow, hyperBG: bloodCategoryHigh, noBG: !entry.bloodGlucose}">
        <h5>{{ entry.bloodGlucose || "N/A" }}</h5>
        <span>
            <p>
                {{ entry.units }}U <i class="fas fa-syringe"></i> 
            </p>
            <!-- If bloods are not provided do not include the unit of measurement. -->
            {{ entry.bloodGlucose ? bloodSugarUnit : ''}}
        </span>
        <h4>{{ time }}</h4>
    </div>
</template>

<script>
export default {
    props: ['entry'],
    data() {
        return {
            bloodSugarUnit: window.localStorage.getItem('app_blood_sugar_unit'),
            minBlood: window.localStorage.getItem("app_minimum_blood_sugar"),
            maxBlood: window.localStorage.getItem("app_maximum_blood_sugar")
        }
    },
    computed: {
        bloodCategoryGood() {
            return (this.entry.bloodGlucose >= this.minBlood && this.entry.bloodGlucose <= this.maxBlood); // returns boolean
        },
        bloodCategoryLow() {
            return (this.entry.bloodGlucose < this.minBlood); // returns boolean
        },
        bloodCategoryHigh() {
            return (this.entry.bloodGlucose > this.maxBlood); // returns boolean
        },
        time() {
            const entryDate = new Temporal.PlainDateTime.from(this.entry.timestamp);
            // .slice(-2) so 8 minutes past becomes 08 and 18 minutes past does not become 018 minutes past.
            return `${entryDate.hour}:${('0' + entryDate.minute).slice(-2)}`;
        }
    },
}
</script>

<style>
    .diaryHolder {
        padding: 5.5% 11.25px;
        margin: 2%;
        display: flex;
    }

    .diaryHolder h5 {
        font-weight: lighter;
        font-size: 28px;
    }

    .diaryHolder h4 {
        font-size: 28px;
        margin-left: auto;
        margin-block-end: 0;
    }

    .diaryHolder p {
        font-size:12px;
    }

    .diaryHolder span {
        margin-left: 6px;
    }

    .diaryHolder.goodBG {
        background-color: olivedrab;
    }

    .diaryHolder.hypoBG {
        background-color: darkred;
    }

    .diaryHolder.hyperBG {
        background-color: darkorange;
    }

    .diaryHolder.noBG {
        background-color: var(--tertiary-colour);
    }
</style>