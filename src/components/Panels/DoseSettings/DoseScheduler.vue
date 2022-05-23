<template>
    <section class="horizCentre">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Cancel" icon="far fa-trash-alt" slimline="true" /> 
        </div>
        <PannelHeader>
            Carb Ratio Scheduler
        </PannelHeader>

        <div style="width: 90%;">
            <Option title="Insulin To Carb Ratio">
                <InputError :value="errors.carbRatio"/>
                <InputArea>
                    <Input placeholder="8" type="number" @new-data="ratio => carbRatio = ratio" step="0.1"/>
                    <InputLabel single="true" :value="`(1:${carbRatio || '?'})`"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        How many carbohydrates per 1 unit of fast acting insulin.
                    </template>
                    <template v-slot:important>
                        Example: 1:10 meaning 1 unit of insulin per 10 grams of carbohydrates.
                    </template>
                </OptionLabel>
            </Option>

            <!-- Spacer -->
            <div style="margin-top: 40px;"></div>

            <Option title="Active Between">
                <InputError :value="errors.time"/>
                <div class="timeBetweenContainer">
                    <input type="time" @input="timeStart = $event.target.value" required>

                    <span>-</span>

                    <input type="time" @input="timeEnd = $event.target.value" required>
                </div>
            </Option>
        </div>
        

        <!-- Spacer -->
        <div style="margin-top: 60px;"></div>
        <ButtonPrimary value="Save" @click="addScheduledRatio()" />
    </section>
</template>

<style scoped>

    div.timeBetweenContainer {
        width: 100%; 
        display: flex;
        align-items: center;
    }

    div.timeBetweenContainer span {
        font-size: 20px;
        padding: 0 20px;
    }

    input[type="time"] {
        background-color: var(--tertiary-colour);
        color: var(--text-colour-main);

        border: none;
        flex: 1;

        font-size: 15px;
        padding: 15px;
    }
</style>

<script>
import MenuItem from "../../menu/MenuItem.vue";
import PannelHeader from "../Components/PanelHeader.vue";

import Option from "../../Options/Option.vue";
import InputArea from "../../Options/InputArea.vue";
import InputError from "../../Options/InputError.vue";
import Input from "../../Options/Input.vue";
import InputLabel from "../../Options/InputLabel.vue";
import InputButton from "../../Options/InputButton.vue";
import OptionLabel from "../../Options/OptionLabel.vue";

import ButtonPrimary from "../../Buttons/Primary.vue";

import secureStorage from "../../../logic/secureStorage.js"

export default {
    components: {
        MenuItem,
        PannelHeader,
        Option,
        InputError,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputArea,
        ButtonPrimary
    },
    data() {
        return {
            // new Temporal.PlainTime.from("00:00");
            timeStart: undefined,
            timeEnd: undefined,
            carbRatio: undefined,
            errors: {
                carbRatio: undefined,
                time: undefined
            }
        }
    },
    methods: {
        addScheduledRatio() {
            // Reset error messages.
            this.errors = {
                carbRatio: undefined,
                time: undefined
            }

            const storageWriteResult = secureStorage.write.carbRatioScheduled({
                carbRatio:this.carbRatio,
                timeStart: this.timeStart,
                timeEnd: this.timeEnd
            });

            if(!storageWriteResult.status) return this.errors[storageWriteResult.target] = storageWriteResult.msg;

            this.$emit('close');
        }
    },
}
</script>