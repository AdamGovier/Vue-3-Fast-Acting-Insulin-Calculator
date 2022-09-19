<!-- https://www.yorkhospitals.nhs.uk/seecmsfile/?id=5394 -->

<template>
    <section class="horizCentre">
        <div @click="close();" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Cancel" icon="far fa-trash-alt" slimline="true" /> 
        </div>

        <PanelHeader>
            Sick Day Rules

            <p style="font-size: 14px; margin-top: 5%; font-weight: normal;">Repeat after 2 hours if ketones still present.</p>
            <!-- <p style="font-size: 17px; margin-top: 12px; font-family: 'Montserrat', sans-serif; font-weight: normal;">
                If you are suffering from high ketones, please contact a medical professional for advice as soon as possible.
            </p> -->
        </PanelHeader>

        <div style="width: 87.5%;">
            <Option title="Total Daily Dose (Rolling 24H)">
                <InputArea>
                    <Input :value="totalDailyDose" @new-data="input => this.totalDailyDose = input" type="number" placeholder="37" />
                    <InputLabel single="true" value="Units"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        How many units of insulin (Bolus & Basal) you have taken in the past 24 hours.
                    </template>
                    <template v-slot:important>
                        If you are unsure, the app has placed a placeholder value based of how many insulin units you have taken in the past 24 hours through bolus calculator.

                        This will NOT include Basal insulin doses. 
                    </template>
                </OptionLabel>
            </Option>

            <Option title="Ketones level">
                <InputArea>
                    <Input :value="ketones" @new-data="input => this.ketones = input" type="number" placeholder="0.0" />
                    <InputLabel single="true" value="mmol/L"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Your current ketones level in mmol/L format.
                    </template>
                </OptionLabel>
            </Option>
        </div>

        <PrimaryButton @click="submit();" style="margin-top: var(--margin-lg);" value="Preview & Apply" />
    </section>
</template>

<script>
import MenuItem from "../../menu/MenuItem.vue";
import PanelHeader from "../Components/PanelHeader.vue";
import Option from "../../Options/Option.vue";
import InputArea from "../../Options/InputArea.vue";
import Input from "../../Options/Input.vue";
import InputLabel from "../../Options/InputLabel.vue";
import OptionLabel from "../../Options/OptionLabel.vue";
import secureStorage from "@/logic/secureStorage";
import PrimaryButton from "@/components/Buttons/Primary.vue";
import yesno from "yesno-dialog";

export default {
    components: {
        MenuItem,
        PanelHeader,
        Option,
        InputArea,
        Input,
        InputLabel,
        OptionLabel,
        PrimaryButton
    },
    props: ['inputKetones', 'inputTotalDailyDose', 'extraDose'],
    data() {
        return {
            ketones: this.inputKetones,
            totalDailyDose: this.inputTotalDailyDose
        }
    },
    mounted() {
        // window.alert("If you are suffering from high ketones, please contact a medical professional for advice as soon as possible. Ketones are very dangerous!")
    },
    methods: {
        async close() {
            if(!this.extraDose) return this.$emit('close');

            const confirm = await yesno({
                bodyText: `Would you like to clear the extra dose currently applied.`,
                labelYes: "Yes",
                labelNo: "No"
            });

            if(confirm) this.$emit("updated", {units: null, totalDailyDose: null, ketones: null});
            this.$emit('close');
        },

        // Preview & Apply button pressed.
        async submit() {
            if(this.ketones > 10) {
                // Most likely using the mg/dL system.

                const confirmCorrectSystem = await yesno({
                    bodyText: `You entered very high ketones are you sure you are using the mmol/L system.`,
                    labelYes: "Yes",
                    labelNo: "No"
                });

                if(!confirmCorrectSystem) return;
            }

            const limits = {
                medium: 0.6,
                high: 1.5
            }

            // Less than 0.6 -> 0%, 0.6 - 1.5 -> 10%, More than 1.5 -> 20%.
            const percentageModifier = this.ketones > limits.high ? 0.2 : this.ketones > limits.medium ? 0.1 : 0;

            let extraInsulin = (this.totalDailyDose * percentageModifier).toFixed(2);

            // Maximum ADDITIONAL rapid dose 10 units.
            if(extraInsulin > 10) extraInsulin = 10;

            const confirmExtraDose = await yesno({
                bodyText: `${extraInsulin} Units of extra insulin recommended, would you like to add that to your dose?`,
                labelYes: "Yes",
                labelNo: "No"
            });

            if(confirmExtraDose) {
                this.$emit("updated", {units: extraInsulin, totalDailyDose: this.totalDailyDose, ketones: this.ketones});
                this.$emit("close");
            } 
        }
    }
}
</script>