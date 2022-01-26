<template>
    <div class="diaryHolder goodBG">
        <h5>{{ entry.bloodGlucose }}</h5>
        <span>
            <p>
                {{ entry.units }}U <i class="fas fa-syringe"></i> 
            </p>
            {{ bloodSugarUnit }}
        </span>
        <h4>{{ time }}</h4>
    </div>
</template>

<script>
import { getHHMM } from "../../logic/utilities";

export default {
    props: ['entry'],
    data() {
        return {
            bloodSugarUnit: window.localStorage.getItem('app_blood_sugar_unit'),
            time: getHHMM(new Date(this.entry.timestamp))
        }
    } 
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
</style>