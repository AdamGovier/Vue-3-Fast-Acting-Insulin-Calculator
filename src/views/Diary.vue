<template>
    <section>   
        <div class="menu-item">
            <i class="fas fa-arrow-circle-left" @click="goBackOneDay();"></i>
            <p>{{ renderDate }}</p>
            <i class="far fa-calendar-alt"></i>
            <i class="fas fa-arrow-circle-right" @click="goForwardOneDay();"></i>
        </div>

        <fieldset v-if="diaryEntries.length" style="margin: 2.5%; margin-top: 20px;"> 
            <legend style="padding: 0 10px;">Average 11.0 mmol/L</legend>
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

import { getDiaryEntries } from '../logic/diary';

export default {
    components: {
        DiaryBlock,
        MenuItem
    },
    data() {
        return {
            date: Temporal.Now.plainDateTimeISO()
        }
    },
    methods: {
        goBackOneDay() {
           this.date = this.date.subtract({days:1})
        },
        goForwardOneDay() {
            this.date = this.date.add({days:1})
        }
    },
    computed: {
        renderDate() {
            const date = this.date;
            return date.toLocaleString('en-GB', { dateStyle: 'medium' });
        },
        diaryEntries() {
            return getDiaryEntries(this.date);
        }
    }
}
</script>