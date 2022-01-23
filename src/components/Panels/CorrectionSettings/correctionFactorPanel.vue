<template>
    <section class="horizCentre">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Cancel" icon="far fa-trash-alt" slimline="true" /> 
        </div>
        <PannelHeader>
            Correction Factor Calculator
        </PannelHeader>

        <div style="width: 87.5%;">
            <Option title="Average Daily Bolus Intake">
                <InputError :value="errors.bolus" v-if="errors.bolus" />
                <InputArea>
                    <Input @new-data="output => inputBolus = output" type="number" placeholder="45" step="0.25"/>
                    <InputLabel single="true" value="Units"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        On a daily basis on average how many units of bolus insulin do you take?
                    </template>
                    <template v-slot:important>
                        The average above should be calculated by adding up your total number of units of bolus insulin for the previous 4 days and then diving by 4.
                    </template>
                </OptionLabel>
            </Option>

            <Option title="Average Daily Basal Intake">
                <InputError :value="errors.basal" v-if="errors.basal" />
                <InputArea>
                    <Input @new-data="output => inputBasal = output" type="number" placeholder="25" step="0.25"/>
                    <InputLabel single="true" value="Units"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        On a daily basis on average how many units of basal insulin do you take?
                    </template>
                </OptionLabel>
            </Option>

            <!-- If all values are checked -->
            <BtnPrimary @click="calculate" :value="inputBolus && inputBasal ? 'Calculate' : 'Missing Values'" :disabled="inputBolus && inputBasal ? false : true" />
        </div>
    </section>

</template>

<script>
import MenuItem from "../../menu/MenuItem.vue";
import PannelHeader from "../../Panels/Components/PanelHeader.vue";

import Option from '../../Options/Option.vue';
import InputArea from '../../Options/InputArea.vue';
import InputLabel from '../../Options/InputLabel.vue';
import Input from '../../Options/Input.vue';
import InputError from '../../Options/InputError.vue';
import OptionLabel from '../../Options/OptionLabel.vue';

import BtnPrimary from '../../Buttons/Primary.vue';

import Panel from '../Panel.vue';
import SafetyPanel from '../SafetyPanel.vue';

export default {
    components: {
        MenuItem,
        PannelHeader,
        Option,
        InputArea,
        InputLabel,
        Input,
        InputError,
        OptionLabel,
        BtnPrimary,
        Panel,
        SafetyPanel
    },
    data() {
        return {
            inputBolus: null,
            inputBasal: null,
            errors: { // Error message for fields
                bolus: "",
                basal: ""
            }
        }
    },
    computed: {
        // Returning a string instead of a number from a nummber input which is interesting, might be platform based so the parseFloat is a sensible measure to have in place.
        bolus() {
            return parseFloat(this.inputBolus);
        },
        basal() {
            return parseFloat(this.inputBasal);
        }
    },
    methods: {
        calculate() {
            // Safety Checks
            this.errors.bolus = null;
            this.errors.basal = null;
            let error = false;

            if(this.bolus <= this.$safety.dailyBolusIntake.min || this.bolus >= this.$safety.dailyBolusIntake.max) {
                this.errors.bolus = "* Value is not within the expected range.";
                error = true;
            }

            if(this.basal <= this.$safety.dailyBasalIntake.min || this.basal >= this.$safety.dailyBasalIntake.max) {
                this.errors.basal = "* Value is not within the expected range.";
                error = true;
            }


            // https://alderhey.nhs.uk/application/files/5315/1731/2400/High_blood_glucose_levels_without_ketones.pdf
            /*
                This is our source on calculating the correction factor.
                "
                    1. Calculate your average Total Daily Dose (TDD) of insulin over about 4 days.
                    2. Divide 100 by your TDD.
                    3. This is the amount 1 unit of insulin will lower your blood glucose level. This is your insulin 
                    sensitivity factor.
                "
            */
            if(!error) { // If no errors from input.
                this.$emit('calculation', (100 / (this.basal + this.bolus)).toFixed(3));
                this.$emit('close');
            }
        }
    },
}
</script>

<style>

</style>