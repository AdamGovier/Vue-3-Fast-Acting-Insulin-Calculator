<template>
    <fieldset class="horizCentre scheduler" >
        <legend>Scheduler</legend>

        <div class="days">
            <!-- Checkbox for every day of the week. -->
            <div class="row">
                <InputCheckBoxButton @handleClick="values.mon = !values.mon" :checkbox="{name:'Mon', checked: values.mon}" />
                <InputCheckBoxButton @handleClick="values.tue = !values.tue" :checkbox="{name:'Tue', checked: values.tue}"/>
                <InputCheckBoxButton @handleClick="values.wed = !values.wed" :checkbox="{name:'Wed', checked: values.wed}"/>
                <InputCheckBoxButton @handleClick="values.thu = !values.thu" :checkbox="{name:'Thu', checked: values.thu}"/>
            </div>
            <div class="row">
                <InputCheckBoxButton @handleClick="values.fri = !values.fri" :checkbox="{name:'Fri', checked: values.fri}"/>
                <InputCheckBoxButton @handleClick="values.sat = !values.sat" :checkbox="{name:'Sat', checked: values.sat}"/>
                <InputCheckBoxButton @handleClick="values.sun = !values.sun" :checkbox="{name:'Sun', checked: values.sun}"/>
            </div>
        </div>

        <div style="width: 90%; margin-top: 10px;">
            <p>Active between</p>
            <div>
                <input @input="values.timeStart = $event.target.valueAsDate" type="time" :value="getTimeStart" :key="values.timeStart"> - <input @input="values.timeEnd = $event.target.valueAsDate" type="time" :value="getTimeEnd" :key="values.timeEnd">
            </div>
        </div>
    </fieldset>
</template>

<script>

import Option from '../Options/Option.vue';
import InputCheckBoxButton from '../Options/InputCheckBoxButton.vue'; // Can't be radio as need multiple to be selected.

export default {
    components: {
        Option,
        InputCheckBoxButton
    },
    data() {
        return {
            values: {
                mon: false,
                tue: false,
                wed: false,
                thu: false,
                fri: false,
                sat: true,
                sun: true,
                timeStart: "Mon Jan 24 2022 00:00:00 GMT+0000",
                timeEnd: "Mon Jan 24 2022 23:59:00 GMT+0000"
            }
        }
    },
    computed: {
        getTimeStart() {
            return this.returnValidTimeInput(new Date(this.values.timeStart));
        },
        getTimeEnd() {
            return this.returnValidTimeInput(new Date(this.values.timeEnd));
        }
    },
    mounted() {
        this.$emit('updated', this.values);
    },
    demounted() {
        this.$emit('updated', null);
    },
    updated() {
        this.$emit('updated', this.values);
    },
    methods: {
        setDate(date) {
            console.log(date)
        },
        returnValidTimeInput(dateObject) { // Returns a time string in the format hh:mm
            const hhmm = dateObject.toISOString().split('T')[1].split(":");
            return hhmm[0] + ":" + hhmm[1];
        }
    },
}
</script>

<style>
    .scheduler {
        border-color: var(--action-colour); 

        padding: 20px 5px;
        margin-top: 10px;
        width: 90%;
    }

    .scheduler .days .row {
        display: flex;
    }

    .scheduler .days .InputCheckBoxButton {
        margin: 0;
    }

    .scheduler .days .InputCheckBoxButton label {
        width: 70px;
        height: 35px;
        font-size: 15px;
        margin: 4px 6px;
    }

    .scheduler .days {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .scheduler input[type="time"] {
        width: 45%;
    }
</style>