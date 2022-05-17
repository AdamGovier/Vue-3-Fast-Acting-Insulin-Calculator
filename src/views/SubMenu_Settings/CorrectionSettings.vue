<template>
    <section class="horizCentre">
        <PannelHeader>
            Correction Settings
        </PannelHeader>
        
        <div style="width: 90%;">
            <Option title="Blood Sugar Unit" centre="true">
                <InputCheckboxRadio @selected="bloodSugarUnitUpdated" :checkboxes="[
                    {
                        name: 'mmol/L',
                        checked: values.bloodSugarUnit === 'mmol/L' ? true : false
                    },
                    {
                        name:'mg/dL',
                        checked: values.bloodSugarUnit === 'mg/dL' ? true : false
                    }
                ]" />
            </Option>
            <br/>
            <!-- This makes the user aware that values have been converted. Intentionally put outside of the Option component. -->
            <InputError v-if="errors.conversionMessage" :value="errors.conversionMessage" /> 
            <Option title="Correction Factor">
                <InputError :value="errors.correctionFactor" v-if="errors.correctionFactor" />
                <InputArea>
                    <Input :value="values.correctionFactor" @new-data="correctionFactor => values.correctionFactor = correctionFactor" type="number" placeholder="2.3" step="0.01"/>
                    <InputLabel :value="values.bloodSugarUnit"/>
                    <InputButton value="?" @click="this.panels.correctionFactorCalcPanel = true" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        The correction factor also known as insulin sensitivity is how much 1 unit of rapid acting insulin will generally lower your blood glucose over 2 to 4 hours.
                    </template>
                    <template v-slot:important>
                        Press "?" if you need help calculating this.
                    </template>
                </OptionLabel>
            </Option>
            
            <Option title="Minimum Blood Sugar">
                <InputError :value="errors.minimumBloodSugar" v-if="errors.minimumBloodSugar" />
                <InputArea>
                    <Input :value="values.minimumBloodSugar" @new-data="minimumBloodSugar => values.minimumBloodSugar = minimumBloodSugar" type="number" placeholder="4.0" step="0.1"/>
                    <InputLabel single="true" :value="values.bloodSugarUnit"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        The minimum blood sugar/blood glucose level before starting to reduce the insulin dose.
                    </template>
                </OptionLabel>
            </Option>

            <Option title="Maximum Blood Sugar">
                <InputError :value="errors.maximumBloodSugar" v-if="errors.maximumBloodSugar" />
                <InputArea>
                    <Input :value="values.maximumBloodSugar"  @new-data="maximumBloodSugar => values.maximumBloodSugar = maximumBloodSugar" type="number" placeholder="7.0" step="0.1"/>
                    <InputLabel single="true" :value="values.bloodSugarUnit"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        The maximum blood sugar/blood glucose level before starting to increase the insulin dose.
                    </template>
                </OptionLabel>
            </Option>

            <Option title="Target Blood Sugar">
                <InputError :value="errors.targetBloodSugar" v-if="errors.targetBloodSugar" />
                <InputArea>
                    <Input :value="values.targetBloodSugar" @new-data="targetBloodSugar => values.targetBloodSugar = targetBloodSugar" type="number" placeholder="5.4" step="0.1"/>
                    <InputLabel single="true" :value="values.bloodSugarUnit"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        The ideal blood sugar to be after taking a correction.
                    </template>
                </OptionLabel>
            </Option>

            <div class="horizCentre">
                <BtnPrimary @click="save();" :value="allRequiredValuesFilled ? 'Save' : 'Missing Values'" :disabled="!allRequiredValuesFilled"/>
            </div>
        </div>
    </section>
    <transition name="slide">
        <Panel v-if="panels.correctionFactorCalcPanel">
            <CorrectionFactorPanel @calculation="correctionFactor => values.correctionFactor = correctionFactor" @close="panels.correctionFactorCalcPanel = false;" />
        </Panel>
    </transition>
</template>

<script>
import Option from '../../components/Options/Option.vue';
import InputArea from '../../components/Options/InputArea.vue';
import Input from '../../components/Options/Input.vue';
import InputLabel from '../../components/Options/InputLabel.vue';
import InputButton from '../../components/Options/InputButton.vue';
import OptionLabel from '../../components/Options/OptionLabel.vue';
import InputCheckboxRadio from '../../components/Options/InputCheckboxRadio.vue';
import InputError from '../../components/Options/InputError.vue';

import BtnPrimary from '../../components/Buttons/Primary.vue';

import Panel from '../../components/Panels/Panel.vue';
import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';
import CorrectionFactorPanel from '../../components/Panels/CorrectionSettings/correctionFactorPanel.vue';

import secureStorage from "../../logic/secureStorage";

export default {
    components: {
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputCheckboxRadio,
        BtnPrimary,
        Panel,
        CorrectionFactorPanel,
        InputError,
        PannelHeader
    },
    data() {
        return {
            panels: {
                correctionFactorCalcPanel: false
            },
            values: {
                bloodSugarUnit: secureStorage.retrieve.bloodSugarUnit(true) || "mmol/L",
                correctionFactor: window.localStorage.getItem('app_correction_factor'),
                minimumBloodSugar: secureStorage.retrieve.minBlood(true),
                maximumBloodSugar: secureStorage.retrieve.maxBlood(true),
                targetBloodSugar: window.localStorage.getItem('app_target_blood_sugar')
            },
            errors: {
                conversionMessage: "",
                correctionFactor: "",
                minimumBloodSugar: "",
                maximumBloodSugar: "",
                targetBloodSugar: ""
            }
        }
    },
    updated() {
        this.emitter.emit("exit-without-saving-dialog", true);
    },
    computed: {
        allRequiredValuesFilled() {
            // double ! To convert to boolean.
            return !!(this.values.correctionFactor && this.values.minimumBloodSugar && this.values.maximumBloodSugar && this.values.targetBloodSugar);
        }
    },
    methods: {
        save() {
            // Safety Check
            const checkValues = ['correctionFactor','minimumBloodSugar','maximumBloodSugar','targetBloodSugar'];
            let error = false;

            checkValues.forEach(input => {
                this.errors[input] = null;

                const min = this.values.bloodSugarUnit === "mg/dL" ? this.$safety[input].min * 18 : this.$safety[input].min;
                const max = this.values.bloodSugarUnit === "mg/dL" ? this.$safety[input].max * 18 : this.$safety[input].max;

                if(this.values[input] <= min || this.values[input] >= max) {
                    this.errors[input] = "* Value is not within the expected range.";
                    error = true;
                }
            });

            if(!error) {
                const storage = window.localStorage;

                // Save values and handle rejections.
                if(!secureStorage.write.bloodSugarUnit(this.values.bloodSugarUnit)) 
                    return this.errors.conversionMessage = "* Unknown error.";

                if(!secureStorage.write.minBlood(parseFloat(this.values.minimumBloodSugar)))
                    return this.errors.minimumBloodSugar = "* Unknown error.";

                if(!secureStorage.write.maxBlood(parseFloat(this.values.maximumBloodSugar)))
                    return this.errors.maximumBloodSugar = "* Unknown error.";

                storage.setItem('app_correction_factor', parseFloat(this.values.correctionFactor));
                storage.setItem('app_target_blood_sugar', parseFloat(this.values.targetBloodSugar));

                // Disable ActionBar override.
                if(!storage.getItem('app_launched_before')) {
                    this.emitter.emit("override-navigation", {path:null, icon:"normal"});
                    storage.setItem('app_launched_before', true);
                    this.$router.push('/');
                } else {
                    this.$router.push('/settings');
                }

                this.emitter.emit("exit-without-saving-dialog", false); // Disable dialog for next navigation page.
            }
        },
        bloodSugarUnitUpdated(system) { // If the checkbox is selected for the blood system.
            // If value is set convert into provided blood sugar unit

            if(this.values.bloodSugarUnit === system) return; // If the updated value is the same as the original value no need to do any conversions or updates.
            this.values.bloodSugarUnit = system; // Set the new blood sugar unit.
            
            const valuesToConvert = [
                "correctionFactor", 
                "minimumBloodSugar", 
                "maximumBloodSugar", 
                "targetBloodSugar"
            ];

            let valuesChanged = false;

            valuesToConvert.forEach(value => {
                if(!this.values[value]) return; // If no value to be converted.

                // https://www.whittington.nhs.uk/document.ashx?id=10803
                // 1 mmol/l glucose (international units) = 18 mg/dl glucose (US units)
                this.values.bloodSugarUnit === "mg/dL" ? this.values[value] *= 18 : this.values[value] /= 18;
                valuesChanged = true;
            });

            // Show a warning message if the values have been converted.
            if(valuesChanged) this.errors.conversionMessage = "* Bolus Calc has converted some of the provided values into " +  this.values.bloodSugarUnit + ", please double check the values before continuing.";
        }
    }
}
</script>