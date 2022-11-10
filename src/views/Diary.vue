<template>
    <section>   
        <div class="menu-item">
            <i class="fas fa-arrow-circle-left" @click="goBackOneDay();"></i>
            <p>{{ renderDate }}</p>
            <i class="far fa-calendar-alt"></i>

            <!-- Show a no entry symbol if current date is today. i.e. you cannot go into the future. -->
            <i class="fas" :class="{'fa-arrow-circle-right': !isToday, 'fa-ban': isToday}" @click="goForwardOneDay();"></i>
        </div>

        <fieldset v-if="diaryEntries.length" style="margin: 2.5%; margin-top: 20px;"> 
            <legend style="padding: 0 10px;">Average: {{this.average}} {{this.bloodSugarUnit}}</legend>
            <!--Arguably should not use a fieldset outside of a form but the css for a fake fieldset is ugly https://stackoverflow.com/questions/2213881/is-it-possible-to-achieve-a-fieldset-like-effect-without-using-the-fieldset-->
            <DiaryBlock v-for="entry in diaryEntries" :entry="entry" />
        </fieldset>

        <p v-if="!diaryEntries.length" style="margin: 2.5%; margin-top: 20px; text-align: center;">
            No entries found for the date: {{ renderDate }}
        </p>
    </section>
</template>

<style scoped>
    .menu-item {
        padding: 5% 0;
    }
</style>

<script>
import DiaryBlock from "../components/Diary/DiaryBlock.vue";
import MenuItem from "../components/menu/MenuItem.vue";
import secureStorage from "../logic/secureStorage";
import averages from "../logic/analytics/averages";

import { getDiaryEntries } from '../logic/diary';
import { isSameDate } from "../logic/utilities";

export default {
    components: {
        DiaryBlock,
        MenuItem
    },
    data() {
        return {
            date: Temporal.Now.plainDateTimeISO(),
            bloodSugarUnit: secureStorage.retrieve.bloodSugarUnit()
        }
    },
    methods: {
        goBackOneDay() {
           this.date = this.date.subtract({days:1})
        },
        goForwardOneDay() {
            if(this.isToday) return; // Don't allow to skip into the future.
            this.date = this.date.add({days:1})
        }
    },
    computed: {
        renderDate() {
            const date = this.date;
            return date.toLocaleString('en-gb', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        },
        diaryEntries() {
            return getDiaryEntries(this.date);
        },
        average() {
            return averages.getMean(this.diaryEntries, "bloodGlucose").toFixed(1);
        },
        isToday() {
            return isSameDate(this.date, Temporal.Now.plainDateTimeISO());
        }
    }
}
</script>