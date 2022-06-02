<template>
    <section>
        <div class="debugger" id="preview" v-if="!showFull" @click="showFull = true;">
            Pre-Alpha Build {{ buildNo }}
        </div>
        <div class="debugger" id="full" v-if="showFull" @click="showFull = false;">
            <h2>Pre-Alpha Build {{ buildNo }}</h2>
            <h2>{{ time }}</h2>
            
            <p class="output">
                <table>
                    <tr>
                        <td>Current Carb Ratio</td>
                        <td>{{ carbRatio }}</td>
                    </tr>
                    <tr v-for="(value, key) in localStorage" >
                        <td>{{key}}</td>
                        <td>{{value}}</td>
                    </tr>
                </table>

            </p>
        </div>
    </section>
</template>

<script>
import { currentCarbRatio } from "../../logic/scheduledCarbRatio";
const storage = window.localStorage;

export default {
    data() {
        return {
            buildNo: this.$build_no,
            showFull: false,
            localStorage: storage,
            carbRatio: undefined,
            time: Temporal.Now.plainDateTimeISO().toString()
        }
    },
    updated() { // On open / close
        this.carbRatio = currentCarbRatio();
        this.localStorage = storage;
    },
    mounted() {
        setInterval(() => {
            this.time = Temporal.Now.plainDateTimeISO().toString();
        }, 100)
    },
}
</script>

<style scoped>
    .debugger {
        position: fixed;
        top: 0;
        right: 0;
        padding: 5px;
        font-size: 8px;
        background-color: black;
        color: white;
        opacity: 0.5;
    }

    #full {
        left: 0;
        width: 100%;
        height: 100%;
        padding: 5%;
        opacity: 0.9;
    }

    .output {
        width: 100%;
        height: 80vh;
        font-size: 20px;
        overflow: scroll;
    }

    table, th, td {
        border-spacing: 0 15px;
        border: 1px solid red;
    }
</style>
