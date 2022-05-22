<template>
    <section class="horizCentre">
        <PannelHeader>
            Dose Settings
        </PannelHeader>

        <!-- <div style="width: 90%;">
            <Option title="Insulin To Carb Ratio">
                <InputError :value="errors.carbRatio" v-if="errors.carbRatio" />
                <InputArea>
                    <Input :value="carbRatio" @new-data="ratio => carbRatio = ratio" type="number" placeholder="8" step="0.1"/>
                    <InputLabel single="true" :value="'(1:' + (carbRatio ? carbRatio : '?') + ')'"/>
                    <InputButton icon="fas fa-clock" @click="this.panels.correctionFactorCalcPanel = true" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        How many carbohydrates per 1 unit of fast acting insulin.
                    </template>
                    <template v-slot:important>
                        Example: 1:10 meaning 1 unit of insulin per 10 grams of carbohydrates.
                        <br/> <br/>
                        Tap the clock to schedule different carb ratios for certain hours of the day.
                    </template>
                </OptionLabel>
            </Option>
        </div> -->
        <DoseDefault v-if="!panels.showScheduler" @showScheduler="panels.showScheduler = true;" />

        <DoseScheduled v-if="panels.showScheduler" @showScheduler="panels.showScheduler = false;" />

        <div class="horizCentre" style="margin-top: 20px; width: 85%;">
            <BtnPrimary :value="carbRatio ? 'Save' : 'Missing Values'" :disabled="!carbRatio" @click="saveDose()"/>
        </div>
    </section>
</template>

<script>
import DoseDefault from '../../components/DoseSettings/DoseDefault.vue';
import DoseScheduled from '../../components/DoseSettings/DoseScheduled.vue';

import Option from '../../components/Options/Option.vue';
import InputArea from '../../components/Options/InputArea.vue';
import Input from '../../components/Options/Input.vue';
import InputLabel from '../../components/Options/InputLabel.vue';
import InputButton from '../../components/Options/InputButton.vue';
import OptionLabel from '../../components/Options/OptionLabel.vue';
import InputError from '../../components/Options/InputError.vue';

import BtnPrimary from '../../components/Buttons/Primary.vue';
import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';

import secureStorage from "../../logic/secureStorage";

export default {
    components: {
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputError,
        BtnPrimary,
        PannelHeader,
        DoseDefault,
        DoseScheduled
    },
    updated() {
        this.emitter.emit("exit-without-saving-dialog", true);
    },
    data() {
        return {
            carbRatio: secureStorage.retrieve.carbRatio(true),
            errors: {
                carbRatio: null
            },
            panels: {
                showScheduler: true
            }
        }
    },
    methods: {
        saveDose() {
            const storage = window.localStorage;

            //Safety Checks

            if(this.carbRatio <= this.$safety.carbRatio.min || this.carbRatio >= this.$safety.carbRatio.max) {
                this.errors.carbRatio = "* Value is not within the expected range.";
                return;
            }

            // write value to storage and handle a rejection to write data. // this should not be rejected as it should be validated above.
            if(!secureStorage.write.carbRatio(this.carbRatio)) return this.errors.carbRatio = "* Unknown error."; 

            if(!storage.getItem('app_launched_before')) {
                this.emitter.emit("override-navigation", {path:'/settings/DoseSettings', icon:"return"});
                this.$router.push('/settings/CorrectionSettings');
            } else {
                this.$router.push('/settings');
            }

            this.emitter.emit("exit-without-saving-dialog", false); // Disable dialog for next navigation page.
        }
    }
}
</script>