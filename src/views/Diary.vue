<template>
    <section>   
        <div class="menu-item">
            <i class="fas fa-arrow-circle-left" @click="goBackOneDay();"></i>
            <p>{{ renderDate }}</p>
            <i class="far fa-calendar-alt"></i>
            <i class="fas fa-arrow-circle-right" @click="goForwardOneDay();"></i>
        </div>

        <fieldset style="margin: 2.5%; margin-top: 20px;"> 
            <legend style="padding: 0 10px;">Average 11.0 mmol/L</legend>
            <!--Arguably should not use a fieldset outside of a form but the css for a fake fieldset is ugly https://stackoverflow.com/questions/2213881/is-it-possible-to-achieve-a-fieldset-like-effect-without-using-the-fieldset-->
            <DiaryBlock v-for="entry in diaryEntries" :entry="entry" />
        </fieldset>
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

import { getDiaryEntries } from '../logic/diary';
import { getDDMMYY } from '../logic/utilities';

export default {
    components: {
        DiaryBlock,
        MenuItem
    },
    data() {
        return {
            date: new Date().getTime()
        }
    },
    methods: {
        goBackOneDay() { // Abstraction
            this.changeDateByOneDay(false);
        },
        goForwardOneDay() { // Abstraction
            this.changeDateByOneDay(true);
        },
        changeDateByOneDay(forward) {
            const newDate = new Date(this.date);
            forward ? newDate.setDate(newDate.getDate() + 1) : newDate.setDate(newDate.getDate() - 1); // Add or subtract one day.
            this.date = newDate.getTime();
        }
    },
    computed: {
        renderDate() {
            // https://stackoverflow.com/questions/2035699/how-to-convert-a-full-date-to-a-short-date-in-javascript

            return getDDMMYY(this.date);
        },
        diaryEntries() {
            return getDiaryEntries(this.renderDate);
        }
    }
}
</script>