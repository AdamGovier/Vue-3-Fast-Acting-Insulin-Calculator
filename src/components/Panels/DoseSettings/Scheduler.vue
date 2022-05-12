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
                <InputError />
                <InputArea>
                    <Input placeholder="8" step="0.1"/>
                    <InputLabel single="true" :value="'(1:' + '?' + ')'"/>
                    <InputButton icon="fas fa-clock" @click="this.$emit('showScheduler')" />
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
                <div class="timeBetweenContainer">
                    <input type="time" id="appt" name="appt"
                    min="09:00" max="18:00" required>
                    <span>-</span>
                    <input type="time" id="appt" name="appt"
                    min="09:00" max="18:00" required>
                </div>
            </Option>
        </div>
        

        <!-- Spacer -->
        <div style="margin-top: 60px;"></div>
        <ButtonPrimary value="Save" />
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
    }
}
</script>